# node / app

Run `node-app-20261026-030106`, 2026-10-26T03:01:07+01:00 to 2026-10-26T03:39:18+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4497 req/s** | 3211 | 12885 | 1 ms | 30 ms | 184 ms | 0.02% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 47% | 252 MB |
| bench-cadvisor-1 | 0% | 30 MB |
| bench-nginx-1 | 16% | 85 MB |
| bench-nginx-exporter-1 | 0% | 9 MB |
| bench-postgres-1 | 20% | 501 MB |
| bench-postgres-exporter-1 | 0% | 10 MB |
| whole VM | 88% | 1187 MB |

The Mac running k6 peaked at 27% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 8 ms | 16 ms | 0.00% | 8% | pass |
| coarse 3 | 22 | 31 | 8 ms | 11 ms | 0.00% | 10% | pass |
| coarse 4 | 34 | 49 | 7 ms | 12 ms | 0.00% | 14% | pass |
| coarse 5 | 51 | 72 | 7 ms | 11 ms | 0.00% | 17% | pass |
| coarse 6 | 76 | 106 | 8 ms | 13 ms | 0.00% | 23% | pass |
| coarse 7 | 114 | 159 | 8 ms | 13 ms | 0.00% | 28% | pass |
| coarse 8 | 171 | 240 | 9 ms | 15 ms | 0.00% | 33% | pass |
| coarse 9 | 256 | 360 | 8 ms | 13 ms | 0.00% | 42% | pass |
| coarse 10 | 384 | 537 | 7 ms | 13 ms | 0.00% | 43% | pass |
| coarse 11 | 577 | 810 | 6 ms | 11 ms | 0.00% | 45% | pass |
| coarse 12 | 865 | 1210 | 5 ms | 10 ms | 0.00% | 49% | pass |
| coarse 13 | 1297 | 1814 | 4 ms | 9 ms | 0.00% | 49% | pass |
| coarse 14 | 1946 | 2721 | 3 ms | 10 ms | 0.00% | 52% | pass |
| coarse 15 | 2919 | 4089 | 13 ms | 104 ms | 0.00% | 82% | pass |
| coarse 16 | 4379 | 3800 | 9432 ms | 14849 ms | 8.81% | 91% | fail: p95 9432 ms, p99 14849 ms, errors 8.8%, k6 dropped 37.4% of sessions |
| fine 1 | 3211 | 4497 | 22 ms | 76 ms | 0.00% | 90% | pass |
| fine 2 | 3503 | 4899 | 532 ms | 2038 ms | 3.05% | 89% | fail: p95 532 ms, p99 2038 ms, errors 3.0% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 3846 | 9825 ms | 29459 ms | 8.26% |
| back at 1x | 4499 | 265 ms | 1659 ms | 0.99% |

Did not recover within 2 minutes.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
