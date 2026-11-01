# node / nginx

Run `node-nginx-20261026-034919`, 2026-10-26T03:49:19+01:00 to 2026-10-26T04:28:35+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4903 req/s** | 3503 | 14043 | 0 ms | 28 ms | 164 ms | 0.30% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 44% | 157 MB |
| bench-cadvisor-1 | 0% | 22 MB |
| bench-nginx-1 | 18% | 78 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 22% | 535 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 89% | 1166 MB |

The Mac running k6 peaked at 23% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 9 ms | 13 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 20 | 8 ms | 12 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 8 ms | 12 ms | 0.00% | 13% | pass |
| coarse 5 | 51 | 71 | 7 ms | 11 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 107 | 8 ms | 12 ms | 0.00% | 21% | pass |
| coarse 7 | 114 | 160 | 8 ms | 13 ms | 0.00% | 29% | pass |
| coarse 8 | 171 | 238 | 8 ms | 15 ms | 0.00% | 34% | pass |
| coarse 9 | 256 | 357 | 8 ms | 14 ms | 0.00% | 41% | pass |
| coarse 10 | 384 | 537 | 7 ms | 12 ms | 0.00% | 43% | pass |
| coarse 11 | 577 | 807 | 6 ms | 11 ms | 0.00% | 44% | pass |
| coarse 12 | 865 | 1211 | 5 ms | 10 ms | 0.00% | 45% | pass |
| coarse 13 | 1297 | 1811 | 3 ms | 7 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2727 | 2 ms | 5 ms | 0.00% | 46% | pass |
| coarse 15 | 2919 | 4078 | 6 ms | 211 ms | 0.39% | 75% | pass |
| coarse 16 | 4379 | 5960 | 304 ms | 381 ms | 19.21% | 100% | fail: p95 304 ms, errors 19.2% |
| fine 1 | 3211 | 4500 | 8 ms | 68 ms | 0.13% | 86% | pass |
| fine 2 | 3503 | 4905 | 23 ms | 146 ms | 0.43% | 87% | pass |
| fine 3 | 3795 | 5235 | 253 ms | 318 ms | 9.82% | 100% | fail: errors 9.8% |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
