#!/usr/bin/env python3
"""Builds dashboards/bench.json. Edit this file, not the JSON, then run:
    python3 harness/monitoring/grafana/build_dashboard.py
"""
import json
from pathlib import Path

DS = {"type": "prometheus", "uid": "prometheus"}
K6 = 'stack=~"$stack", phase=~"$phase"'
WIN = "30s"  # k6 pushes every 5 s; 30 s windows keep the lines readable

panels = []
_id = 0
_y = 0


def next_id():
    global _id
    _id += 1
    return _id


def row(title):
    global _y
    panels.append({"id": next_id(), "type": "row", "title": title, "collapsed": False,
                   "gridPos": {"x": 0, "y": _y, "w": 24, "h": 1}, "panels": []})
    _y += 1


def targets(exprs, fmt="time_series", instant=False):
    return [{"refId": chr(65 + i), "datasource": DS, "expr": e, "legendFormat": l,
             "format": fmt, "instant": instant, "range": not instant}
            for i, (e, l) in enumerate(exprs)]


def thresholds_line(values):
    steps = [{"color": "transparent", "value": None}]
    steps += [{"color": "red", "value": v} for v in values]
    return {"mode": "absolute", "steps": steps}


def right_axis(series, unit):
    """Override: draw series (by legend name) on a right-hand axis with its own unit."""
    return {"matcher": {"id": "byName", "options": series},
            "properties": [{"id": "custom.axisPlacement", "value": "right"}, {"id": "unit", "value": unit}]}


def ts(title, exprs, unit, x, w, h=8, desc="", lines=None, maxv=None, stack=False, overrides=None):
    custom = {"lineWidth": 2, "fillOpacity": 10 if stack else 5, "showPoints": "never",
              "spanNulls": True, "stacking": {"mode": "normal" if stack else "none"}}
    defaults = {"unit": unit, "custom": custom}
    if lines:
        custom["thresholdsStyle"] = {"mode": "line"}
        defaults["thresholds"] = thresholds_line(lines)
    if maxv is not None:
        defaults["max"] = maxv
        defaults["min"] = 0
    return {"id": next_id(), "type": "timeseries", "title": title, "description": desc,
            "datasource": DS, "gridPos": {"x": x, "y": _y, "w": w, "h": h},
            "fieldConfig": {"defaults": defaults, "overrides": overrides or []},
            "options": {"legend": {"displayMode": "list", "placement": "bottom"},
                        "tooltip": {"mode": "multi", "sort": "desc"}},
            "targets": targets(exprs)}


def stat(title, expr, unit, x, w=4, red_above=None, decimals=None):
    steps = [{"color": "green", "value": None}]
    if red_above is not None:
        steps.append({"color": "red", "value": red_above})
    defaults = {"unit": unit, "thresholds": {"mode": "absolute", "steps": steps}}
    if decimals is not None:
        defaults["decimals"] = decimals
    return {"id": next_id(), "type": "stat", "title": title, "datasource": DS,
            "gridPos": {"x": x, "y": _y, "w": w, "h": 4},
            "fieldConfig": {"defaults": defaults, "overrides": []},
            "options": {"reduceOptions": {"calcs": ["lastNotNull"], "fields": "", "values": False},
                        "colorMode": "background", "graphMode": "area", "textMode": "value"},
            "targets": targets([(expr, title)])}


def add(*ps, h=8):
    global _y
    panels.extend(ps)
    _y += h


def q(p, by=""):
    grp = f" by ({by})" if by else ""
    return f"histogram_quantile({p}, sum{grp} (rate(k6_http_req_duration_seconds{{{K6}}}[{WIN}])))"


reqs = f"sum(rate(k6_http_reqs_total{{{K6}}}[{WIN}]))"
errs = f'sum(rate(k6_http_reqs_total{{{K6}, expected_response="false"}}[{WIN}]))'
vm_cpu = f'sum(rate(container_cpu_usage_seconds_total{{id="/"}}[{WIN}]))'

# ---------------------------------------------------------------- summary
row("Summary")
add(stat("Requests / s", reqs, "reqps", 0, decimals=0),
    stat("p95 latency", q(0.95), "s", 4, red_above=0.3),
    stat("p99 latency", q(0.99), "s", 8, red_above=1),
    stat("Error rate", f"({errs} or vector(0)) / {reqs}", "percentunit", 12, red_above=0.01, decimals=2),
    stat("Virtual users", f"sum(k6_vus{{{K6}}})", "none", 16),
    stat("Server CPU (1 core)", vm_cpu, "percentunit", 20, red_above=0.9),
    h=4)

# ---------------------------------------------------------------- k6
row("Load, measured by k6 from outside the server")
add(ts("Latency percentiles", [(q(0.50), "p50"), (q(0.90), "p90"), (q(0.95), "p95"), (q(0.99), "p99")],
       "s", 0, 12, desc="Red lines: pass criteria, p95 < 300 ms and p99 < 1 s", lines=[0.3, 1]),
    ts("Requests / s by endpoint", [(f"sum by (name) (rate(k6_http_reqs_total{{{K6}}}[{WIN}]))", "{{name}}")],
       "reqps", 12, 12, stack=True))
add(ts("p95 latency by endpoint", [(q(0.95, "name"), "{{name}}")], "s", 0, 12, lines=[0.3]),
    ts("Error rate by endpoint",
       [(f'(sum by (name) (rate(k6_http_reqs_total{{{K6}, expected_response="false"}}[{WIN}])) '
         f"or 0 * sum by (name) (rate(k6_http_reqs_total{{{K6}}}[{WIN}]))) "
         f"/ sum by (name) (rate(k6_http_reqs_total{{{K6}}}[{WIN}]))", "{{name}}")],
       "percentunit", 12, 12, desc="Red line: pass criteria, errors < 1%", lines=[0.01]))
add(ts("Responses by status code", [(f"sum by (status) (rate(k6_http_reqs_total{{{K6}}}[{WIN}]))", "{{status}}")],
       "reqps", 0, 12, stack=True),
    ts("Virtual users", [(f"sum(k6_vus{{{K6}}})", "VUs")], "none", 12, 12))

# ---------------------------------------------------------------- server
row("Server: the 1 vCPU, 2 GB bench VM")
add(ts("CPU by container",
       [(f'sum by (name) (rate(container_cpu_usage_seconds_total{{name!=""}}[{WIN}]))', "{{name}}"),
        (vm_cpu, "whole VM")],
       "percentunit", 0, 12, desc="1.0 = the whole core. Red line at 90%.", lines=[0.9], maxv=1.1),
    ts("Memory by container",
       [('sum by (name) (container_memory_working_set_bytes{name!=""})', "{{name}}"),
        ('sum(container_memory_working_set_bytes{id="/"})', "whole VM")],
       "bytes", 12, 12, desc="Red line: the VM's 2 GB", lines=[2 * 1024 ** 3]))
add(ts("Network by container (received)",
       [(f'sum by (name) (rate(container_network_receive_bytes_total{{name!=""}}[{WIN}]))', "{{name}}")],
       "Bps", 0, 12),
    ts("Disk writes by container",
       [(f'sum by (name) (rate(container_fs_writes_bytes_total{{name!=""}}[{WIN}]))', "{{name}}")],
       "Bps", 12, 12, desc="Mostly Postgres WAL and checkpoints"))

# ---------------------------------------------------------------- nginx
row("Nginx")
add(ts("Requests handled / s", [(f"rate(nginx_http_requests_total[{WIN}])", "requests")], "reqps", 0, 12),
    ts("Connections", [("nginx_connections_active", "active"), ("nginx_connections_reading", "reading"),
                       ("nginx_connections_writing", "writing"), ("nginx_connections_waiting", "idle keep-alive")],
       "none", 12, 12))

# ---------------------------------------------------------------- postgres
row("Postgres")
add(ts("Transactions / s",
       [(f'sum(rate(pg_stat_database_xact_commit{{datname="app"}}[{WIN}]))', "commits"),
        (f'sum(rate(pg_stat_database_xact_rollback{{datname="app"}}[{WIN}]))', "rollbacks")],
       "ops", 0, 8),
    ts("Connections by state", [('sum by (state) (pg_stat_activity_count{datname="app"})', "{{state}}")],
       "none", 8, 8, desc="max_connections = 50", stack=True),
    ts("Buffer cache hit ratio",
       [(f'sum(rate(pg_stat_database_blks_hit{{datname="app"}}[{WIN}])) / '
         f'(sum(rate(pg_stat_database_blks_hit{{datname="app"}}[{WIN}])) + '
         f'sum(rate(pg_stat_database_blks_read{{datname="app"}}[{WIN}])))', "hit ratio")],
       "percentunit", 16, 8, desc="Share of reads served from shared_buffers instead of disk"))
add(ts("Rows / s",
       [(f'sum(rate(pg_stat_database_tup_fetched{{datname="app"}}[{WIN}]))', "fetched"),
        (f'sum(rate(pg_stat_database_tup_inserted{{datname="app"}}[{WIN}]))', "inserted"),
        (f'sum(rate(pg_stat_database_tup_updated{{datname="app"}}[{WIN}]))', "updated")],
       "ops", 0, 8),
    ts("Locks by mode", [('sum by (mode) (pg_locks_count{datname="app"})', "{{mode}}")], "none", 8, 8,
       desc="Row locks from like_count updates show up here"),
    ts("Deadlocks and database size",
       [(f'sum(increase(pg_stat_database_deadlocks{{datname="app"}}[1m]))', "deadlocks / min"),
        ('sum(pg_database_size_bytes{datname="app"}) / 1e9', "size (GB)")],
       "none", 16, 8))
top = {"id": next_id(), "type": "table", "title": "Top queries by total time (last 5 min)",
       "description": "From pg_stat_statements. Look up the text with: "
                      "SELECT query FROM pg_stat_statements WHERE queryid = <id>;",
       "datasource": DS, "gridPos": {"x": 0, "y": _y, "w": 24, "h": 8},
       "fieldConfig": {"defaults": {}, "overrides": [
           {"matcher": {"id": "byName", "options": "Value #A"},
            "properties": [{"id": "displayName", "value": "total time (s)"}, {"id": "decimals", "value": 2}]},
           {"matcher": {"id": "byName", "options": "Value #B"},
            "properties": [{"id": "displayName", "value": "calls"}, {"id": "decimals", "value": 0}]}]},
       "options": {"showHeader": True, "sortBy": [{"displayName": "total time (s)", "desc": True}]},
       "transformations": [{"id": "merge"}, {"id": "organize", "options": {
           "excludeByName": {"Time": True}, "renameByName": {"queryid": "query id"}}}],
       "targets": targets([
           ('topk(10, sum by (queryid) (increase(pg_stat_statements_seconds_total{datname="app"}[5m])))', ""),
           ('sum by (queryid) (increase(pg_stat_statements_calls_total{datname="app"}[5m]))', "")],
           fmt="table", instant=True)}
add(top)

# ---------------------------------------------------------------- app
row("App: measured inside the stack (empty if the stack exposes no metrics)")
add(ts("Time inside the app, p95 by route",
       [(f"histogram_quantile(0.95, sum by (le, route) (rate(app_http_request_duration_seconds_bucket[{WIN}])))", "{{route}}")],
       "s", 0, 12, desc="Compare with k6's p95: the difference is Nginx, the network and queueing before the app"),
    ts("Database connection pool",
       [("sum by (state) (app_db_pool_connections)", "{{state}}"), ("max(app_db_pool_max)", "pool max")],
       "none", 12, 12, desc="Waiting above zero: requests queue for a connection, the pool is the limit"))
add(ts("Feed cache hit ratio (app-cache phase)",
       [(f'sum(rate(app_feed_cache_requests_total{{result="hit"}}[{WIN}])) / sum(rate(app_feed_cache_requests_total[{WIN}]))', "hit ratio")],
       "percentunit", 0, 8, maxv=1),
    ts("Node.js event loop lag",
       [("max(nodejs_eventloop_lag_p99_seconds)", "p99"), ("max(nodejs_eventloop_lag_mean_seconds)", "mean")],
       "s", 8, 8, desc="How late the event loop runs. On one CPU, rising lag means the process is saturated"),
    ts("Node.js heap and GC",
       [("max(nodejs_heap_size_used_bytes)", "heap used"),
        (f"sum(rate(nodejs_gc_duration_seconds_sum[{WIN}]))", "GC seconds per second")],
       "none", 16, 8, desc="Heap in bytes; GC as the share of each second spent collecting"))

# ---------------------------------------------------------------- mac
row("Load generator and trust checks: is k6 telling the truth?")
add(ts("Mac CPU busy",
       [(f'1 - avg(rate(node_cpu_seconds_total{{job="mac", mode="idle"}}[{WIN}]))', "busy")],
       "percentunit", 0, 12, maxv=1, lines=[0.7],
       desc="If this goes above 70%, k6 may be slowing the bench VM down. Recorded in every run's checks."),
    ts("Mac memory pressure",
       [('node_memory_compressed_bytes{job="mac"}', "compressed"),
        ('node_memory_swap_used_bytes{job="mac"}', "swap used"),
        ('node_memory_free_bytes{job="mac"}', "free")],
       "bytes", 12, 12,
       desc="macOS compresses memory when it runs short, which costs CPU and slows k6. Compressed rising more "
            "than 2 GB during a run triggers the runner's memory warning. Thousands of virtual users cost "
            "about 250 KB each."))
add(ts("Requests / s: Nginx vs k6",
       [(f"sum(rate(nginx_http_requests_total[{WIN}]))", "Nginx (received)"),
        (f"sum(rate(k6_http_reqs_total{{{K6}}}[{WIN}]))", "k6 (recorded)")],
       "reqps", 0, 12,
       desc="Two independent counts of the same traffic. The lines should lie on top of each other. If they "
            "split, one of them is wrong, most likely k6. The runner checks the totals for every confirm and "
            "overload test (within 2%). Nginx also counts the exporter's scrape, 0.2 requests/s."),
    ts("k6 virtual users and dropped sessions",
       [(f"sum(k6_vus{{{K6}}})", "busy"), (f"sum(k6_vus_max{{{K6}}})", "pool"),
        (f"sum(rate(k6_dropped_iterations_total{{{K6}}}[{WIN}])) or vector(0)", "dropped / s")],
       "none", 12, 12, overrides=[right_axis("dropped / s", "short")],
       desc="Busy reaching the pool means k6 ran out of virtual users and drops sessions (right axis): it "
            "couldn't send the load it should. Expected during the 1.5x overload phase, a problem anywhere else."))

dashboard = {
    "uid": "bench", "title": "one-cpu-which-backend-wins", "tags": ["bench"],
    "timezone": "browser", "schemaVersion": 39, "refresh": "5s", "editable": True,
    "time": {"from": "now-30m", "to": "now"},
    "templating": {"list": [
        {"name": n, "label": n, "type": "query", "datasource": DS,
         "query": {"query": f"label_values(k6_vus, {n})", "refId": n},
         "definition": f"label_values(k6_vus, {n})",
         "includeAll": True, "multi": True, "allValue": ".*",
         "current": {"text": "All", "value": "$__all"}, "refresh": 2}
        for n in ("stack", "phase")]},
    "panels": panels,
}

out = Path(__file__).parent / "dashboards" / "bench.json"
out.write_text(json.dumps(dashboard, indent=2) + "\n")
print(f"wrote {out} ({len(panels)} panels)")
