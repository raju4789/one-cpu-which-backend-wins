# node / none

Run `node-none-20261025-124346`, 2026-10-25T12:43:46+01:00 to 2026-10-25T13:18:53+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1818 req/s** | 1297 | 5200 | 1 ms | 39 ms | 96 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 30% | 189 MB |
| bench-cadvisor-1 | 0% | 22 MB |
| bench-nginx-1 | 6% | 34 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 46% | 249 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 85% | 723 MB |

The Mac running k6 peaked at 25% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 9 ms | 13 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 10 ms | 13 ms | 0.00% | 13% | pass |
| coarse 3 | 22 | 31 | 10 ms | 14 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 47 | 10 ms | 17 ms | 0.00% | 24% | pass |
| coarse 5 | 51 | 72 | 11 ms | 17 ms | 0.00% | 32% | pass |
| coarse 6 | 76 | 106 | 11 ms | 19 ms | 0.00% | 40% | pass |
| coarse 7 | 114 | 160 | 10 ms | 17 ms | 0.00% | 48% | pass |
| coarse 8 | 171 | 240 | 8 ms | 14 ms | 0.00% | 47% | pass |
| coarse 9 | 256 | 358 | 7 ms | 14 ms | 0.00% | 51% | pass |
| coarse 10 | 384 | 536 | 5 ms | 14 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 808 | 4 ms | 14 ms | 0.00% | 55% | pass |
| coarse 12 | 865 | 1213 | 3 ms | 13 ms | 0.00% | 57% | pass |
| coarse 13 | 1297 | 1814 | 60 ms | 90 ms | 0.00% | 85% | pass |
| coarse 14 | 1946 | 1811 | 3046 ms | 3080 ms | 21.50% | 97% | fail: p95 3046 ms, p99 3080 ms, errors 21.5%, k6 dropped 33.9% of sessions |
| fine 1 | 1427 | 1854 | 3046 ms | 3079 ms | 21.40% | 94% | fail: p95 3046 ms, p99 3079 ms, errors 21.4%, k6 dropped 6.9% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1775 | 3191 ms | 3290 ms | 21.47% |
| back at 1x | 1748 | 3261 ms | 3336 ms | 20.53% |

Did not recover within 2 minutes.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.52 s.
