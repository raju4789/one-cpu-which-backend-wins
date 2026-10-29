# node / app

Run `node-app-20261025-232749`, 2026-10-25T23:27:49+01:00 to 2026-10-26T00:14:51+01:00

**Warning:** the Mac compressed 2.0 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4496 req/s** | 3211 | 12861 | 1 ms | 11 ms | 84 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 45% | 198 MB |
| bench-cadvisor-1 | 0% | 25 MB |
| bench-nginx-1 | 16% | 78 MB |
| bench-nginx-exporter-1 | 0% | 8 MB |
| bench-postgres-1 | 19% | 601 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 84% | 1220 MB |

The Mac running k6 peaked at 22% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 13 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 7 ms | 11 ms | 0.00% | 8% | pass |
| coarse 3 | 22 | 30 | 8 ms | 13 ms | 0.00% | 10% | pass |
| coarse 4 | 34 | 48 | 8 ms | 11 ms | 0.00% | 13% | pass |
| coarse 5 | 51 | 71 | 7 ms | 11 ms | 0.00% | 17% | pass |
| coarse 6 | 76 | 105 | 8 ms | 12 ms | 0.00% | 21% | pass |
| coarse 7 | 114 | 161 | 8 ms | 13 ms | 0.00% | 31% | pass |
| coarse 8 | 171 | 240 | 9 ms | 14 ms | 0.00% | 39% | pass |
| coarse 9 | 256 | 360 | 7 ms | 13 ms | 0.00% | 44% | pass |
| coarse 10 | 384 | 537 | 7 ms | 11 ms | 0.00% | 45% | pass |
| coarse 11 | 577 | 807 | 6 ms | 10 ms | 0.00% | 46% | pass |
| coarse 12 | 865 | 1210 | 5 ms | 9 ms | 0.00% | 45% | pass |
| coarse 13 | 1297 | 1817 | 3 ms | 7 ms | 0.00% | 48% | pass |
| coarse 14 | 1946 | 2720 | 2 ms | 7 ms | 0.00% | 52% | pass |
| coarse 15 | 2919 | 4092 | 6 ms | 23 ms | 0.00% | 75% | pass |
| coarse 16 | 4379 | 5063 | 8932 ms | 11219 ms | 7.66% | 100% | fail: p95 8932 ms, p99 11219 ms, errors 7.7%, k6 dropped 15.6% of sessions |
| fine 1 | 3211 | 4499 | 53 ms | 223 ms | 0.09% | 84% | pass |
| fine 2 | 3503 | 4901 | 228 ms | 413 ms | 0.77% | 92% | pass |
| fine 3 | 3795 | 5282 | 2072 ms | 5139 ms | 6.10% | 95% | fail: p95 2072 ms, p99 5139 ms, errors 6.1% |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
