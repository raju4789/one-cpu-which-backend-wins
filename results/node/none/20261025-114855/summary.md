# node / none

Run `node-none-20261025-114855`, 2026-10-25T11:48:55+01:00 to 2026-10-25T12:33:46+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1573 req/s** | 1124 | 4499 | 1 ms | 13 ms | 34 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 28% | 173 MB |
| bench-cadvisor-1 | 0% | 22 MB |
| bench-nginx-1 | 5% | 28 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 40% | 269 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 76% | 758 MB |

The Mac running k6 peaked at 18% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 12 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 10 ms | 15 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 11 ms | 16 ms | 0.00% | 18% | pass |
| coarse 4 | 34 | 48 | 11 ms | 17 ms | 0.00% | 24% | pass |
| coarse 5 | 51 | 71 | 11 ms | 16 ms | 0.00% | 31% | pass |
| coarse 6 | 76 | 105 | 11 ms | 17 ms | 0.00% | 41% | pass |
| coarse 7 | 114 | 159 | 9 ms | 16 ms | 0.00% | 45% | pass |
| coarse 8 | 171 | 239 | 8 ms | 14 ms | 0.00% | 47% | pass |
| coarse 9 | 256 | 357 | 8 ms | 14 ms | 0.00% | 52% | pass |
| coarse 10 | 384 | 539 | 5 ms | 15 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 809 | 4 ms | 14 ms | 0.00% | 56% | pass |
| coarse 12 | 865 | 1212 | 4 ms | 16 ms | 0.00% | 57% | pass |
| coarse 13 | 1297 | 1816 | 1010 ms | 1360 ms | 0.11% | 84% | fail: p95 1010 ms, p99 1360 ms |
| fine 1 | 952 | 1335 | 5 ms | 16 ms | 0.00% | 68% | pass |
| fine 2 | 1038 | 1456 | 6 ms | 17 ms | 0.00% | 70% | pass |
| fine 3 | 1124 | 1571 | 13 ms | 28 ms | 0.00% | 73% | pass |
| fine 4 | 1211 | 1697 | 14 ms | 43 ms | 0.00% | 76% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1633 | 4667 ms | 4852 ms | 21.34% |
| back at 1x | 1462 | 4761 ms | 4859 ms | 20.51% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.49 s.
