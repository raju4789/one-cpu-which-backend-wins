# node / none

Run `node-none-20261026-043836`, 2026-10-26T04:38:36+01:00 to 2026-10-26T05:13:43+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1817 req/s** | 1297 | 5210 | 2 ms | 78 ms | 114 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 338 MB |
| bench-cadvisor-1 | 0% | 24 MB |
| bench-nginx-1 | 6% | 53 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 47% | 412 MB |
| bench-postgres-exporter-1 | 0% | 9 MB |
| whole VM | 85% | 1181 MB |

The Mac running k6 peaked at 19% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 14 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 10 ms | 16 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 31 | 10 ms | 15 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 48 | 10 ms | 17 ms | 0.00% | 23% | pass |
| coarse 5 | 51 | 71 | 10 ms | 14 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 107 | 11 ms | 18 ms | 0.00% | 39% | pass |
| coarse 7 | 114 | 160 | 10 ms | 17 ms | 0.00% | 45% | pass |
| coarse 8 | 171 | 238 | 8 ms | 16 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 358 | 8 ms | 17 ms | 0.00% | 51% | pass |
| coarse 10 | 384 | 537 | 5 ms | 15 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 805 | 4 ms | 13 ms | 0.00% | 56% | pass |
| coarse 12 | 865 | 1211 | 3 ms | 13 ms | 0.00% | 59% | pass |
| coarse 13 | 1297 | 1815 | 68 ms | 105 ms | 0.00% | 88% | pass |
| coarse 14 | 1946 | 1773 | 3200 ms | 3331 ms | 21.34% | 100% | fail: p95 3200 ms, p99 3331 ms, errors 21.3%, k6 dropped 35.0% of sessions |
| fine 1 | 1427 | 1812 | 3272 ms | 3345 ms | 21.41% | 94% | fail: p95 3272 ms, p99 3345 ms, errors 21.4%, k6 dropped 9.3% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1775 | 3226 ms | 3387 ms | 21.34% |
| back at 1x | 1778 | 3124 ms | 3190 ms | 20.56% |

Did not recover within 2 minutes.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
