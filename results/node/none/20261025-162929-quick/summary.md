# node / none (quick run, for tuning only)

Run `node-none-20261025-162929`, 2026-10-25T16:29:29+01:00 to 2026-10-25T16:37:40+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1707 req/s** | 1221 | 4894 | 1 ms | 59 ms | 82 ms | 0.75% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 32% | 135 MB |
| bench-cadvisor-1 | 0% | 44 MB |
| bench-nginx-1 | 6% | 34 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 40% | 245 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 83% | 795 MB |

The Mac running k6 peaked at 25% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 969 | 1359 | 5 ms | 16 ms | 0.00% | 63% | pass |
| coarse 2 | 1047 | 1466 | 5 ms | 16 ms | 0.00% | 65% | pass |
| coarse 3 | 1130 | 1588 | 21 ms | 47 ms | 0.04% | 68% | pass |
| coarse 4 | 1221 | 1707 | 59 ms | 82 ms | 0.75% | 83% | pass |
| coarse 5 | 1318 | 1836 | 59 ms | 87 ms | 1.26% | 86% | fail: errors 1.3% |

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.62 s.
