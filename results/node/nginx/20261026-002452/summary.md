# node / nginx

Run `node-nginx-20261026-002452`, 2026-10-26T00:24:52+01:00 to 2026-10-26T01:04:09+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4904 req/s** | 3503 | 14045 | 0 ms | 32 ms | 180 ms | 0.36% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 46% | 175 MB |
| bench-cadvisor-1 | 0% | 40 MB |
| bench-nginx-1 | 17% | 88 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 23% | 573 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 89% | 1253 MB |

The Mac running k6 peaked at 23% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 15 ms | 0.00% | 5% | pass |
| coarse 2 | 15 | 21 | 8 ms | 13 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 30 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 8 ms | 11 ms | 0.00% | 12% | pass |
| coarse 5 | 51 | 70 | 7 ms | 11 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 107 | 8 ms | 11 ms | 0.00% | 20% | pass |
| coarse 7 | 114 | 159 | 8 ms | 14 ms | 0.00% | 30% | pass |
| coarse 8 | 171 | 239 | 9 ms | 15 ms | 0.00% | 36% | pass |
| coarse 9 | 256 | 361 | 8 ms | 14 ms | 0.00% | 42% | pass |
| coarse 10 | 384 | 538 | 7 ms | 12 ms | 0.00% | 43% | pass |
| coarse 11 | 577 | 809 | 6 ms | 11 ms | 0.00% | 44% | pass |
| coarse 12 | 865 | 1210 | 5 ms | 11 ms | 0.00% | 44% | pass |
| coarse 13 | 1297 | 1812 | 3 ms | 8 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2725 | 2 ms | 6 ms | 0.00% | 50% | pass |
| coarse 15 | 2919 | 4087 | 5 ms | 21 ms | 0.00% | 74% | pass |
| coarse 16 | 4379 | 5952 | 302 ms | 375 ms | 19.75% | 98% | fail: p95 302 ms, errors 19.7% |
| fine 1 | 3211 | 4497 | 9 ms | 56 ms | 0.00% | 83% | pass |
| fine 2 | 3503 | 4894 | 19 ms | 62 ms | 0.00% | 91% | pass |
| fine 3 | 3795 | 5233 | 252 ms | 316 ms | 9.41% | 97% | fail: errors 9.4% |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
