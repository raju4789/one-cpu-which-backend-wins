# node / none

Run `node-none-20261025-092122`, 2026-10-25T09:21:22+01:00 to 2026-10-25T09:56:51+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1697 req/s** | 1211 | 4897 | 1 ms | 281 ms | 487 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 33% | 222 MB |
| bench-cadvisor-1 | 0% | 21 MB |
| bench-nginx-1 | 6% | 44 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 45% | 276 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 82% | 764 MB |

The Mac running k6 peaked at 21% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 12 ms | 16 ms | 0.00% | 10% | pass |
| coarse 2 | 15 | 21 | 11 ms | 16 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 11 ms | 15 ms | 0.00% | 19% | pass |
| coarse 4 | 34 | 47 | 10 ms | 17 ms | 0.00% | 24% | pass |
| coarse 5 | 51 | 72 | 11 ms | 16 ms | 0.00% | 31% | pass |
| coarse 6 | 76 | 107 | 11 ms | 18 ms | 0.00% | 40% | pass |
| coarse 7 | 114 | 159 | 10 ms | 19 ms | 0.00% | 46% | pass |
| coarse 8 | 171 | 239 | 8 ms | 14 ms | 0.00% | 45% | pass |
| coarse 9 | 256 | 358 | 7 ms | 14 ms | 0.00% | 52% | pass |
| coarse 10 | 384 | 538 | 5 ms | 16 ms | 0.00% | 55% | pass |
| coarse 11 | 577 | 805 | 5 ms | 17 ms | 0.00% | 51% | pass |
| coarse 12 | 865 | 1213 | 6 ms | 16 ms | 0.00% | 59% | pass |
| coarse 13 | 1297 | 1815 | 2302 ms | 2565 ms | 8.00% | 92% | fail: p95 2302 ms, p99 2565 ms, errors 8.0% |
| fine 1 | 952 | 1336 | 7 ms | 16 ms | 0.00% | 64% | pass |
| fine 2 | 1038 | 1456 | 12 ms | 26 ms | 0.00% | 68% | pass |
| fine 3 | 1124 | 1574 | 16 ms | 49 ms | 0.00% | 70% | pass |
| fine 4 | 1211 | 1697 | 20 ms | 41 ms | 0.00% | 83% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1717 | 3428 ms | 3568 ms | 21.47% |
| back at 1x | 1693 | 3387 ms | 3458 ms | 20.53% |

Did not recover within 2 minutes.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.67 s.
