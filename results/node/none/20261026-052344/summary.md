# node / none

Run `node-none-20261026-052344`, 2026-10-26T05:23:44+01:00 to 2026-10-26T06:07:41+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1812 req/s** | 1297 | 5200 | 1 ms | 29 ms | 81 ms | 0.06% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 166 MB |
| bench-cadvisor-1 | 0% | 38 MB |
| bench-nginx-1 | 6% | 52 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 42% | 502 MB |
| bench-postgres-exporter-1 | 0% | 11 MB |
| whole VM | 83% | 1128 MB |

The Mac running k6 peaked at 35% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 12 ms | 0.00% | 8% | pass |
| coarse 2 | 15 | 21 | 9 ms | 15 ms | 0.00% | 11% | pass |
| coarse 3 | 22 | 31 | 9 ms | 14 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 48 | 9 ms | 14 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 71 | 9 ms | 17 ms | 0.00% | 31% | pass |
| coarse 6 | 76 | 107 | 10 ms | 18 ms | 0.00% | 40% | pass |
| coarse 7 | 114 | 161 | 10 ms | 17 ms | 0.00% | 46% | pass |
| coarse 8 | 171 | 239 | 8 ms | 13 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 357 | 7 ms | 14 ms | 0.00% | 52% | pass |
| coarse 10 | 384 | 536 | 6 ms | 14 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 806 | 4 ms | 14 ms | 0.00% | 52% | pass |
| coarse 12 | 865 | 1210 | 3 ms | 12 ms | 0.00% | 60% | pass |
| coarse 13 | 1297 | 1815 | 16 ms | 50 ms | 0.00% | 76% | pass |
| coarse 14 | 1946 | 2520 | 228 ms | 249 ms | 39.21% | 95% | fail: errors 39.2% |
| fine 1 | 1427 | 1993 | 131 ms | 157 ms | 0.10% | 90% | pass |
| fine 2 | 1556 | 2120 | 200 ms | 228 ms | 12.71% | 100% | fail: errors 12.7% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2509 | 238 ms | 262 ms | 41.35% |
| back at 1x | 1814 | 19 ms | 56 ms | 0.00% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
