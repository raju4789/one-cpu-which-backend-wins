# node / none

Run `node-none-20261025-132854`, 2026-10-25T13:28:54+01:00 to 2026-10-25T14:05:54+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1694 req/s** | 1211 | 4847 | 1 ms | 18 ms | 43 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 29% | 329 MB |
| bench-cadvisor-1 | 0% | 21 MB |
| bench-nginx-1 | 5% | 28 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 44% | 306 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 80% | 976 MB |

The Mac running k6 peaked at 19% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 9 ms | 16 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 10 ms | 14 ms | 0.00% | 13% | pass |
| coarse 3 | 22 | 31 | 10 ms | 16 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 47 | 10 ms | 15 ms | 0.00% | 24% | pass |
| coarse 5 | 51 | 72 | 10 ms | 15 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 106 | 10 ms | 18 ms | 0.00% | 41% | pass |
| coarse 7 | 114 | 161 | 10 ms | 18 ms | 0.00% | 47% | pass |
| coarse 8 | 171 | 240 | 8 ms | 14 ms | 0.00% | 46% | pass |
| coarse 9 | 256 | 359 | 7 ms | 13 ms | 0.00% | 51% | pass |
| coarse 10 | 384 | 541 | 5 ms | 14 ms | 0.00% | 52% | pass |
| coarse 11 | 577 | 807 | 4 ms | 14 ms | 0.00% | 53% | pass |
| coarse 12 | 865 | 1217 | 4 ms | 13 ms | 0.00% | 58% | pass |
| coarse 13 | 1297 | 1816 | 2149 ms | 2232 ms | 5.89% | 96% | fail: p95 2149 ms, p99 2232 ms, errors 5.9% |
| fine 1 | 952 | 1333 | 4 ms | 16 ms | 0.00% | 66% | pass |
| fine 2 | 1038 | 1456 | 7 ms | 19 ms | 0.00% | 68% | pass |
| fine 3 | 1124 | 1577 | 12 ms | 32 ms | 0.00% | 68% | pass |
| fine 4 | 1211 | 1697 | 16 ms | 66 ms | 0.00% | 76% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1752 | 3267 ms | 3365 ms | 21.47% |
| back at 1x | 1695 | 2934 ms | 3096 ms | 13.87% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
