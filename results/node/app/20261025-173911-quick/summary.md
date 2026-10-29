# node / app (quick run, for tuning only)

Run `node-app-20261025-173911`, 2026-10-25T17:39:11+01:00 to 2026-10-25T17:45:24+01:00

**Warning:** calibration 5.74 s is 5% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **3926 req/s** | 2808 | 11270 | 1 ms | 27 ms | 181 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 42% | 151 MB |
| bench-cadvisor-1 | 0% | 46 MB |
| bench-nginx-1 | 15% | 104 MB |
| bench-nginx-exporter-1 | 0% | 18 MB |
| bench-postgres-1 | 17% | 239 MB |
| bench-postgres-exporter-1 | 0% | 14 MB |
| whole VM | 77% | 848 MB |

The Mac running k6 peaked at 24% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 2600 | 3642 | 6 ms | 34 ms | 0.00% | 72% | pass |
| coarse 2 | 2808 | 3926 | 27 ms | 181 ms | 0.00% | 77% | pass |
| coarse 3 | 3033 | 4245 | 363 ms | 2632 ms | 0.65% | 88% | fail: p95 363 ms, p99 2632 ms |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.74 s.
