# node / none (quick run, for tuning only)

Run `node-none-20261025-170737`, 2026-10-25T17:07:37+01:00 to 2026-10-25T17:21:38+01:00

**Warning:** calibration 5.81 s is 6% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1582 req/s** | 1130 | 4532 | 1 ms | 29 ms | 62 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 136 MB |
| bench-cadvisor-1 | 0% | 46 MB |
| bench-nginx-1 | 6% | 37 MB |
| bench-nginx-exporter-1 | 0% | 18 MB |
| bench-postgres-1 | 37% | 221 MB |
| bench-postgres-exporter-1 | 0% | 18 MB |
| whole VM | 80% | 780 MB |

The Mac running k6 peaked at 27% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 969 | 1356 | 11 ms | 37 ms | 0.00% | 71% | pass |
| coarse 2 | 1047 | 1462 | 16 ms | 36 ms | 0.00% | 75% | pass |
| coarse 3 | 1130 | 1582 | 29 ms | 62 ms | 0.00% | 80% | pass |
| coarse 4 | 1221 | 1705 | 190 ms | 229 ms | 1.38% | 88% | fail: errors 1.4% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2216 | 242 ms | 280 ms | 34.97% |
| back at 1x | 1583 | 22 ms | 85 ms | 0.00% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.81 s.
