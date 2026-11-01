# node / none

Run `node-none-20261025-215529`, 2026-10-25T21:55:29+01:00 to 2026-10-25T22:32:30+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1698 req/s** | 1211 | 4851 | 1 ms | 17 ms | 49 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 28% | 179 MB |
| bench-cadvisor-1 | 0% | 22 MB |
| bench-nginx-1 | 6% | 50 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 44% | 476 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 78% | 1160 MB |

The Mac running k6 peaked at 17% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 14 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 10 ms | 14 ms | 0.00% | 13% | pass |
| coarse 3 | 22 | 30 | 11 ms | 16 ms | 0.00% | 18% | pass |
| coarse 4 | 34 | 48 | 11 ms | 16 ms | 0.00% | 25% | pass |
| coarse 5 | 51 | 72 | 11 ms | 18 ms | 0.00% | 34% | pass |
| coarse 6 | 76 | 108 | 11 ms | 18 ms | 0.00% | 41% | pass |
| coarse 7 | 114 | 159 | 10 ms | 18 ms | 0.00% | 48% | pass |
| coarse 8 | 171 | 236 | 9 ms | 17 ms | 0.00% | 49% | pass |
| coarse 9 | 256 | 358 | 7 ms | 14 ms | 0.00% | 50% | pass |
| coarse 10 | 384 | 536 | 5 ms | 14 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 808 | 4 ms | 16 ms | 0.00% | 55% | pass |
| coarse 12 | 865 | 1211 | 4 ms | 14 ms | 0.00% | 61% | pass |
| coarse 13 | 1297 | 1817 | 1467 ms | 1872 ms | 0.59% | 89% | fail: p95 1467 ms, p99 1872 ms |
| fine 1 | 952 | 1336 | 4 ms | 15 ms | 0.00% | 61% | pass |
| fine 2 | 1038 | 1452 | 8 ms | 22 ms | 0.00% | 70% | pass |
| fine 3 | 1124 | 1574 | 12 ms | 27 ms | 0.00% | 77% | pass |
| fine 4 | 1211 | 1696 | 20 ms | 48 ms | 0.00% | 77% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1773 | 3159 ms | 3205 ms | 21.40% |
| back at 1x | 1697 | 2349 ms | 2666 ms | 10.24% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.53 s.
