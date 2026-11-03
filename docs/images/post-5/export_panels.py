#!/usr/bin/env python3
"""Exports the post 5 runs from Prometheus into panels-data.json, in the same
format as posts 3 and 4 (the dashboard's panels 9, 10, 12 and 16), plus memory
by container, which is what the crashes are about. Run once on the Mac, with
both VMs up, from the repo root:

    python3 docs/images/post-5/export_panels.py

Runs (batch 20261103-055403): tuned no cache run 6, untuned run 1, app cache
run 11, Nginx cache run 4. A tuned run's window is the confirm start to +795 s
(confirm and overload), like posts 3 and 4; a crashed run's is its coarse ramp
up to 30 s after the crash.
"""
import datetime, json, os, subprocess, sys, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
RUNS = {  # key: (results dir, kind)
    "01-untuned-crash": ("results/spring/none/20261103-055403", "crash"),
    "02-tuned-no-cache": ("results/spring/none/20261103-083648", "confirm"),
    "03-app-cache-crash": ("results/spring/app/20261103-113856", "crash"),
    "04-nginx-cache-crash": ("results/spring/nginx/20261103-074003", "crash"),
}
prom = subprocess.run(["bash", "-c", 'source harness/bin/common.sh; printf %s "$PROM_URL"'],
                      cwd=REPO, capture_output=True, text=True).stdout
if not prom:
    sys.exit("no PROM_URL: is the monitoring VM up? (harness/bin/vm-up)")
W = "30s"
SHORT = lambda n: {"bench-app-1": "app", "bench-nginx-1": "nginx", "bench-postgres-1": "postgres"}.get(n, n)


def query(q, start, end):
    url = f"{prom}/api/v1/query_range?" + urllib.parse.urlencode({"query": q, "start": start, "end": end, "step": 5})
    data = json.load(urllib.request.urlopen(url, timeout=60))
    if data["status"] != "success":
        sys.exit(f"query failed: {q}: {data}")
    return data["data"]["result"]


def first_sample(sel, start, end):
    r = query(f"sum(k6_http_reqs_total{{{sel}}})", start, end)
    return r[0]["values"][0][0] if r else None


def series(result, label, t0, rename=lambda n: n):
    return [[rename(s["metric"].get(label, "whole VM")), [[round(float(t) - t0), float(v)] for t, v in s["values"]]]
            for s in result]


out = {}
for key, (path, kind) in RUNS.items():
    r = json.load(open(os.path.join(REPO, path, "result.json")))
    run_id = r["run_id"]
    started = datetime.datetime.fromisoformat(r["started"]).timestamp()
    finished = datetime.datetime.fromisoformat(r["finished"]).timestamp()
    K = f'run_id="{run_id}"'
    if kind == "confirm":
        rate = r["result"]["rate"]
        t0 = first_sample(f'{K},test="confirm-{rate}"', started, finished)
        ov = first_sample(f'{K},test="overload"', started, finished)
        t1 = t0 + 795
        extra = {"overload_start": round(ov - t0), "rate": rate, "rps": r["result"]["rps"]}
    else:
        t0 = first_sample(f'{K},test="ramp-coarse"', started, finished)
        crash = datetime.datetime.fromisoformat(r["crash"]["finished_at"][:26] + "+00:00").timestamp()
        t1 = crash + 30
        extra = {"crash_at": round(crash - t0), "crash": r["crash"]["text"],
                 "steps": [[s["rate"], round(s["rps"]), s.get("passed")] for s in r["ramp"]["coarse"]]}
    if t0 is None:
        sys.exit(f"no k6 data for {run_id} in Prometheus (deleted, or another VM?)")
    q95 = f"histogram_quantile(0.95, sum(rate(k6_http_req_duration_seconds{{{K}}}[{W}])))"
    q99 = f"histogram_quantile(0.99, sum(rate(k6_http_req_duration_seconds{{{K}}}[{W}])))"
    reqs = f"sum by (name) (rate(k6_http_reqs_total{{{K}}}[{W}]))"
    errs = (f'(sum by (name) (rate(k6_http_reqs_total{{{K}, expected_response="false"}}[{W}])) '
            f"or 0 * {reqs}) / {reqs}")
    cpu = f'sum by (name) (rate(container_cpu_usage_seconds_total{{name=~"bench-(app|nginx|postgres)-1"}}[{W}]))'
    cpu_vm = f'sum(rate(container_cpu_usage_seconds_total{{id="/"}}[{W}]))'
    mem = 'sum by (name) (container_memory_working_set_bytes{name=~"bench-(app|nginx|postgres)-1"})'
    mem_vm = 'sum(container_memory_working_set_bytes{id="/"})'
    p95, p99 = query(q95, t0, t1), query(q99, t0, t1)
    panels = {
        "9": [["p95", series(p95, "x", t0)[0][1] if p95 else []], ["p99", series(p99, "x", t0)[0][1] if p99 else []]],
        "10": series(query(reqs, t0, t1), "name", t0),
        "12": series(query(errs, t0, t1), "name", t0),
        "16": series(query(cpu, t0, t1), "name", t0, SHORT) + series(query(cpu_vm, t0, t1), "x", t0),
        "mem": series(query(mem, t0, t1), "name", t0, SHORT) + series(query(mem_vm, t0, t1), "x", t0),
    }
    out[key] = dict(run=run_id, day=datetime.datetime.fromtimestamp(t0).strftime("%-d %b"),
                    **{"from": datetime.datetime.fromtimestamp(t0).strftime("%H:%M:%S"),
                       "to": datetime.datetime.fromtimestamp(t1).strftime("%H:%M:%S")},
                    seconds=round(t1 - t0), panels=panels, **extra)
    print(f"{key}: {run_id}, {round(t1 - t0)} s, " + ", ".join(f"panel {k} {len(v)} series" for k, v in panels.items()))

with open(os.path.join(HERE, "panels-data.json"), "w") as f:
    json.dump(out, f)
print("wrote docs/images/post-5/panels-data.json")
