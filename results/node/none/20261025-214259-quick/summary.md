# node / none (quick run, for tuning only)

Run `node-none-20261025-214259`, 2026-10-25T21:42:59+01:00 to 2026-10-25T21:51:14+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1712 req/s** | 1221 | 4899 | 1 ms | 41 ms | 87 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 30% | 138 MB |
| bench-cadvisor-1 | 0% | 21 MB |
| bench-nginx-1 | 5% | 56 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 44% | 309 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 86% | 875 MB |

The Mac running k6 peaked at 32% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 969 | 1356 | 7 ms | 20 ms | 0.00% | 62% | pass |
| coarse 2 | 1047 | 1465 | 10 ms | 24 ms | 0.00% | 72% | pass |
| coarse 3 | 1130 | 1584 | 21 ms | 75 ms | 0.00% | 79% | pass |
| coarse 4 | 1221 | 1712 | 41 ms | 87 ms | 0.00% | 86% | pass |
| coarse 5 | 1318 | 1757 | 3970 ms | 4279 ms | 21.11% | 96% | fail: p95 3970 ms, p99 4279 ms, errors 21.1%, k6 dropped 4.9% of sessions |

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.5 s.
