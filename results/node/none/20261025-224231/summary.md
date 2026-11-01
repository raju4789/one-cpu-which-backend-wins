# node / none

Run `node-none-20261025-224231`, 2026-10-25T22:42:31+01:00 to 2026-10-25T23:17:48+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1816 req/s** | 1297 | 5193 | 1 ms | 18 ms | 48 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 156 MB |
| bench-cadvisor-1 | 0% | 36 MB |
| bench-nginx-1 | 6% | 54 MB |
| bench-nginx-exporter-1 | 0% | 12 MB |
| bench-postgres-1 | 42% | 429 MB |
| bench-postgres-exporter-1 | 0% | 14 MB |
| whole VM | 80% | 1069 MB |

The Mac running k6 peaked at 16% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 9 ms | 16 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 9 ms | 16 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 30 | 9 ms | 12 ms | 0.00% | 15% | pass |
| coarse 4 | 34 | 48 | 9 ms | 14 ms | 0.00% | 23% | pass |
| coarse 5 | 51 | 72 | 9 ms | 14 ms | 0.00% | 28% | pass |
| coarse 6 | 76 | 107 | 10 ms | 16 ms | 0.00% | 40% | pass |
| coarse 7 | 114 | 159 | 9 ms | 18 ms | 0.00% | 46% | pass |
| coarse 8 | 171 | 238 | 8 ms | 14 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 360 | 7 ms | 14 ms | 0.00% | 49% | pass |
| coarse 10 | 384 | 538 | 6 ms | 14 ms | 0.00% | 53% | pass |
| coarse 11 | 577 | 810 | 4 ms | 13 ms | 0.00% | 55% | pass |
| coarse 12 | 865 | 1212 | 3 ms | 13 ms | 0.00% | 59% | pass |
| coarse 13 | 1297 | 1814 | 15 ms | 49 ms | 0.00% | 78% | pass |
| coarse 14 | 1946 | 2512 | 230 ms | 260 ms | 40.16% | 97% | fail: errors 40.2% |
| fine 1 | 1427 | 1977 | 185 ms | 216 ms | 4.17% | 88% | fail: errors 4.2% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2514 | 233 ms | 261 ms | 40.32% |
| back at 1x | 1815 | 20 ms | 66 ms | 0.00% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
