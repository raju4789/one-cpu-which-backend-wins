#!/usr/bin/env python3
"""Exports a run's ramp from Prometheus into crash-data.json, so the crash chart can be
drawn (and redrawn) after Prometheus has deleted the data. Run on the Mac, VMs up:

    python3 docs/images/post-5/export_crash_data.py spring-none-20261102-072004

Same queries as the Grafana dashboard (harness/monitoring/grafana/build_dashboard.py),
5-second steps, from 30 s before the coarse ramp to 60 s after the run's end.
"""
import datetime, json, os, subprocess, sys, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
run_id = sys.argv[1]
stack, phase, stamp = run_id.split("-", 2)
result = json.load(open(os.path.join(REPO, "results", stack, phase, stamp, "result.json")))
prom = subprocess.run(["bash", "-c", 'source harness/bin/common.sh; printf %s "$PROM_URL"'],
                      cwd=REPO, capture_output=True, text=True).stdout
if not prom:
    sys.exit("no PROM_URL: is the monitoring VM up? (harness/bin/vm-up)")

K, W = f'run_id="{run_id}",test="ramp-coarse"', "30s"
queries = {
    "reqs_by": f"sum by (name) (rate(k6_http_reqs_total{{{K}}}[{W}]))",
    "p95": f"histogram_quantile(0.95, sum(rate(k6_http_req_duration_seconds{{{K}}}[{W}])))",
    "p99": f"histogram_quantile(0.99, sum(rate(k6_http_req_duration_seconds{{{K}}}[{W}])))",
    "err_by": (f'(sum by (name) (rate(k6_http_reqs_total{{{K}, expected_response="false"}}[{W}])) '
               f"or 0 * sum by (name) (rate(k6_http_reqs_total{{{K}}}[{W}]))) "
               f"/ sum by (name) (rate(k6_http_reqs_total{{{K}}}[{W}]))"),
    "mem": 'sum by (name) (container_memory_working_set_bytes{name=~"bench-(app|nginx|postgres)-1"})',
    "mem_vm": 'sum(container_memory_working_set_bytes{id="/"})',
    "cpu": f'sum by (name) (rate(container_cpu_usage_seconds_total{{name=~"bench-(app|nginx|postgres)-1"}}[{W}]))',
    "cpu_vm": f'sum(rate(container_cpu_usage_seconds_total{{id="/"}}[{W}]))',
}


def query(q, start, end):
    url = f"{prom}/api/v1/query_range?" + urllib.parse.urlencode(
        {"query": q, "start": start, "end": end, "step": 5})
    data = json.load(urllib.request.urlopen(url, timeout=30))
    return [[s["metric"].get("name", "total"), [[float(t), float(v)] for t, v in s["values"]]]
            for s in data["data"]["result"]]


# The coarse ramp's first and last k6 sample give its start; the run's finish time its end.
started = datetime.datetime.fromisoformat(result["started"]).timestamp()
finished = datetime.datetime.fromisoformat(result["finished"]).timestamp()
probe = query(f"sum(k6_http_reqs_total{{{K}}})", started, finished)
if not probe:
    sys.exit(f"no ramp-coarse data for {run_id} in Prometheus (deleted, or a different VM?)")
ramp_start = probe[0][1][0][0]
start, end = ramp_start - 30, finished + 60
out = {"run": run_id, "ramp_start": ramp_start, "start": start, "end": end,
       "crash": result.get("crash"), "steps": [s["rate"] for s in result["ramp"]["coarse"]],
       "series": {k: query(q, start, end) for k, q in queries.items()}}
path = os.path.join(HERE, "crash-data.json")
with open(path, "w") as f:
    json.dump(out, f)
print(f"wrote {os.path.relpath(path, REPO)}: " +
      ", ".join(f"{k} {len(v)} series" for k, v in out["series"].items()))
