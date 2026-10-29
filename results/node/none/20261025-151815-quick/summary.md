# node / none (quick run, for tuning only)

Run `node-none-20261025-151815`, 2026-10-25T15:18:15+01:00 to 2026-10-25T15:26:14+01:00

**Warning:** calibration 5.70 s is 3% slower than the reference 5.52 s (median of earlier complete runs): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1709 req/s** | 1221 | 4899 | 1 ms | 44 ms | 73 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 30% | 134 MB |
| bench-cadvisor-1 | 0% | 25 MB |
| bench-nginx-1 | 5% | 32 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 44% | 240 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 81% | 643 MB |

The Mac running k6 peaked at 18% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 969 | 1358 | 7 ms | 19 ms | 0.00% | 59% | pass |
| coarse 2 | 1047 | 1469 | 9 ms | 21 ms | 0.00% | 68% | pass |
| coarse 3 | 1130 | 1581 | 15 ms | 38 ms | 0.00% | 78% | pass |
| coarse 4 | 1221 | 1709 | 44 ms | 73 ms | 0.00% | 81% | pass |
| coarse 5 | 1318 | 1820 | 3291 ms | 3353 ms | 12.65% | 91% | fail: p95 3291 ms, p99 3353 ms, errors 12.6%, k6 dropped 1.5% of sessions |

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.7 s.
