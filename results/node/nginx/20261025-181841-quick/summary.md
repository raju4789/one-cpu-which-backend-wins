# node / nginx (quick run, for tuning only)

Run `node-nginx-20261025-181841`, 2026-10-25T18:18:41+01:00 to 2026-10-25T18:28:38+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4931 req/s** | 3526 | 14135 | 0 ms | 31 ms | 124 ms | 0.06% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 43% | 149 MB |
| bench-cadvisor-1 | 0% | 20 MB |
| bench-nginx-1 | 18% | 66 MB |
| bench-nginx-exporter-1 | 0% | 6 MB |
| bench-postgres-1 | 23% | 505 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 91% | 1113 MB |

The Mac running k6 peaked at 24% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 2400 | 3353 | 2 ms | 9 ms | 0.00% | 62% | pass |
| coarse 2 | 2592 | 3633 | 3 ms | 16 ms | 0.00% | 65% | pass |
| coarse 3 | 2799 | 3915 | 4 ms | 22 ms | 0.00% | 72% | pass |
| coarse 4 | 3023 | 4229 | 6 ms | 26 ms | 0.00% | 73% | pass |
| coarse 5 | 3265 | 4569 | 9 ms | 30 ms | 0.00% | 75% | pass |
| coarse 6 | 3526 | 4931 | 31 ms | 124 ms | 0.06% | 91% | pass |
| coarse 7 | 3808 | 5241 | 252 ms | 305 ms | 10.16% | 96% | fail: errors 10.2% |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.54 s.
