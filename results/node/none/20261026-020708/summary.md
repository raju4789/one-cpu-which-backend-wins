# node / none

Run `node-none-20261026-020708`, 2026-10-26T02:07:08+01:00 to 2026-10-26T02:51:06+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1815 req/s** | 1297 | 5192 | 1 ms | 17 ms | 49 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 30% | 168 MB |
| bench-cadvisor-1 | 0% | 36 MB |
| bench-nginx-1 | 6% | 53 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 41% | 494 MB |
| bench-postgres-exporter-1 | 0% | 12 MB |
| whole VM | 80% | 1113 MB |

The Mac running k6 peaked at 16% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 12 ms | 0.00% | 8% | pass |
| coarse 2 | 15 | 21 | 9 ms | 14 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 31 | 9 ms | 13 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 48 | 9 ms | 13 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 72 | 10 ms | 19 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 107 | 10 ms | 16 ms | 0.00% | 39% | pass |
| coarse 7 | 114 | 158 | 9 ms | 16 ms | 0.00% | 46% | pass |
| coarse 8 | 171 | 239 | 8 ms | 14 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 358 | 7 ms | 14 ms | 0.00% | 52% | pass |
| coarse 10 | 384 | 537 | 5 ms | 16 ms | 0.00% | 54% | pass |
| coarse 11 | 577 | 809 | 4 ms | 13 ms | 0.00% | 58% | pass |
| coarse 12 | 865 | 1211 | 3 ms | 12 ms | 0.00% | 56% | pass |
| coarse 13 | 1297 | 1816 | 14 ms | 34 ms | 0.00% | 75% | pass |
| coarse 14 | 1946 | 2515 | 229 ms | 249 ms | 39.66% | 97% | fail: errors 39.7% |
| fine 1 | 1427 | 1998 | 136 ms | 169 ms | 0.28% | 90% | pass |
| fine 2 | 1556 | 2122 | 203 ms | 240 ms | 13.55% | 92% | fail: errors 13.5% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2506 | 235 ms | 263 ms | 41.20% |
| back at 1x | 1815 | 18 ms | 48 ms | 0.00% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
