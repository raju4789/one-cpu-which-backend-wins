# node / app

Run `node-app-20261026-061742`, 2026-10-26T06:17:42+01:00 to 2026-10-26T06:54:54+01:00

**Warning:** the Mac compressed 3.2 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4089 req/s** | 2919 | 11687 | 1 ms | 12 ms | 39 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 44% | 189 MB |
| bench-cadvisor-1 | 0% | 33 MB |
| bench-nginx-1 | 15% | 75 MB |
| bench-nginx-exporter-1 | 0% | 13 MB |
| bench-postgres-1 | 17% | 504 MB |
| bench-postgres-exporter-1 | 0% | 12 MB |
| whole VM | 81% | 1110 MB |

The Mac running k6 peaked at 25% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 8% | pass |
| coarse 3 | 22 | 30 | 8 ms | 13 ms | 0.00% | 11% | pass |
| coarse 4 | 34 | 47 | 8 ms | 11 ms | 0.00% | 13% | pass |
| coarse 5 | 51 | 71 | 7 ms | 12 ms | 0.00% | 18% | pass |
| coarse 6 | 76 | 107 | 8 ms | 13 ms | 0.00% | 24% | pass |
| coarse 7 | 114 | 160 | 8 ms | 14 ms | 0.00% | 32% | pass |
| coarse 8 | 171 | 238 | 9 ms | 15 ms | 0.00% | 36% | pass |
| coarse 9 | 256 | 359 | 8 ms | 14 ms | 0.00% | 44% | pass |
| coarse 10 | 384 | 539 | 7 ms | 12 ms | 0.00% | 43% | pass |
| coarse 11 | 577 | 806 | 6 ms | 11 ms | 0.00% | 46% | pass |
| coarse 12 | 865 | 1214 | 5 ms | 10 ms | 0.00% | 48% | pass |
| coarse 13 | 1297 | 1815 | 4 ms | 8 ms | 0.00% | 45% | pass |
| coarse 14 | 1946 | 2719 | 3 ms | 8 ms | 0.00% | 55% | pass |
| coarse 15 | 2919 | 4082 | 8 ms | 68 ms | 0.00% | 77% | pass |
| coarse 16 | 4379 | 2515 | 12231 ms | 16529 ms | 11.65% | 92% | fail: p95 12231 ms, p99 16529 ms, errors 11.6%, k6 dropped 58.3% of sessions |
| fine 1 | 3211 | 4496 | 233 ms | 1713 ms | 0.62% | 87% | fail: p99 1713 ms |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
