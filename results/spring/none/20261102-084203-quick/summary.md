# spring / none (quick run, for tuning only)

Run `spring-none-20261102-084203`, 2026-11-02T08:42:03+01:00 to 2026-11-02T08:58:50+01:00

## The app crashed

App crashed at 1616 sessions/s x1.5 (overload): container exited, killed by the out-of-memory killer, stopped at 2026-11-02T07:57:31.04004039Z.

The run stopped there. Anything below was measured before the crash.

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2265 req/s** | 1616 | 6476 | 1 ms | 46 ms | 76 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 20% | 332 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 7% | 53 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 49% | 489 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 77% | 1436 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.13 cores, 3794 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.60 s (+2.0% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 32865b14d2, stack 32865b14d2 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 1100 | 1540 | 2 ms | 8 ms | 0.00% | 55% | pass |
| coarse 2 | 1188 | 1665 | 1 ms | 3 ms | 0.00% | 64% | pass |
| coarse 3 | 1283 | 1799 | 2 ms | 17 ms | 0.00% | 66% | pass |
| coarse 4 | 1386 | 1942 | 2 ms | 15 ms | 0.00% | 65% | pass |
| coarse 5 | 1497 | 2092 | 3 ms | 44 ms | 0.00% | 72% | pass |
| coarse 6 | 1616 | 2265 | 46 ms | 76 ms | 0.00% | 77% | pass |
| coarse 7 | 1746 | 2444 | 1106 ms | 1172 ms | 0.00% | 92% | fail: p95 1106 ms, p99 1172 ms |

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.6 s.
