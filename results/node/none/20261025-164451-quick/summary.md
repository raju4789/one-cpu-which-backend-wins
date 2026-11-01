# node / none (quick run, for tuning only)

Run `node-none-20261025-164451`, 2026-10-25T16:44:51+01:00 to 2026-10-25T17:00:50+01:00

**Warning:** calibration 5.69 s is 4% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1851 req/s** | 1318 | 5303 | 1 ms | 84 ms | 189 ms | 0.30% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 146 MB |
| bench-cadvisor-1 | 0% | 37 MB |
| bench-nginx-1 | 6% | 35 MB |
| bench-nginx-exporter-1 | 0% | 16 MB |
| bench-postgres-1 | 42% | 238 MB |
| bench-postgres-exporter-1 | 0% | 12 MB |
| whole VM | 81% | 819 MB |

The Mac running k6 peaked at 21% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 969 | 1357 | 10 ms | 60 ms | 0.00% | 64% | pass |
| coarse 2 | 1047 | 1462 | 10 ms | 32 ms | 0.00% | 65% | pass |
| coarse 3 | 1130 | 1579 | 8 ms | 21 ms | 0.00% | 72% | pass |
| coarse 4 | 1221 | 1711 | 13 ms | 31 ms | 0.00% | 72% | pass |
| coarse 5 | 1318 | 1851 | 84 ms | 189 ms | 0.30% | 81% | pass |
| coarse 6 | 1424 | 1975 | 186 ms | 213 ms | 4.25% | 91% | fail: errors 4.3% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2536 | 242 ms | 269 ms | 42.99% |
| back at 1x | 1845 | 26 ms | 57 ms | 0.00% |

Recovered.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.69 s.
