# node / nginx

Run `node-nginx-20261026-070455`, 2026-10-26T07:04:55+01:00 to 2026-10-26T07:44:10+01:00

**Warning:** the Mac compressed 2.2 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4901 req/s** | 3503 | 14040 | 0 ms | 26 ms | 155 ms | 0.26% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 45% | 205 MB |
| bench-cadvisor-1 | 0% | 43 MB |
| bench-nginx-1 | 18% | 83 MB |
| bench-nginx-exporter-1 | 0% | 13 MB |
| bench-postgres-1 | 22% | 533 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 90% | 1243 MB |

The Mac running k6 peaked at 23% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 12 ms | 0.00% | 5% | pass |
| coarse 2 | 15 | 22 | 8 ms | 13 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 8 ms | 12 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 8 ms | 11 ms | 0.00% | 12% | pass |
| coarse 5 | 51 | 72 | 8 ms | 12 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 107 | 8 ms | 13 ms | 0.00% | 22% | pass |
| coarse 7 | 114 | 160 | 8 ms | 14 ms | 0.00% | 29% | pass |
| coarse 8 | 171 | 240 | 9 ms | 16 ms | 0.00% | 38% | pass |
| coarse 9 | 256 | 360 | 8 ms | 13 ms | 0.00% | 39% | pass |
| coarse 10 | 384 | 537 | 7 ms | 12 ms | 0.00% | 38% | pass |
| coarse 11 | 577 | 810 | 6 ms | 11 ms | 0.00% | 44% | pass |
| coarse 12 | 865 | 1211 | 5 ms | 10 ms | 0.00% | 43% | pass |
| coarse 13 | 1297 | 1815 | 3 ms | 8 ms | 0.00% | 43% | pass |
| coarse 14 | 1946 | 2718 | 2 ms | 6 ms | 0.00% | 52% | pass |
| coarse 15 | 2919 | 4092 | 4 ms | 18 ms | 0.00% | 66% | pass |
| coarse 16 | 4379 | 5763 | 1052 ms | 3401 ms | 23.82% | 95% | fail: p95 1052 ms, p99 3401 ms, errors 23.8%, k6 dropped 3.1% of sessions |
| fine 1 | 3211 | 4489 | 7 ms | 25 ms | 0.00% | 84% | pass |
| fine 2 | 3503 | 4904 | 18 ms | 68 ms | 0.00% | 88% | pass |
| fine 3 | 3795 | 5222 | 261 ms | 338 ms | 10.34% | 96% | fail: errors 10.3% |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
