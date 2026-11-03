# spring / app (quick run, for tuning only)

Run `spring-app-20261102-202415`, 2026-11-02T20:24:15+01:00 to 2026-11-02T20:37:19+01:00

## The app crashed

App crashed at 3780 sessions/s x1.5 (overload): container exited, killed by the out-of-memory killer, stopped at 2026-11-02T19:33:27.685814993Z.

The run stopped there. Anything below was measured before the crash.

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **5296 req/s** | 3780 | 15134 | 0 ms | 4 ms | 17 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 34% | 475 MB |
| bench-cadvisor-1 | 0% | 28 MB |
| bench-nginx-1 | 20% | 73 MB |
| bench-nginx-exporter-1 | 0% | 11 MB |
| bench-postgres-1 | 22% | 486 MB |
| bench-postgres-exporter-1 | 0% | 15 MB |
| whole VM | 83% | 1505 MB |

The Mac running k6 peaked at 21% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 21% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 2.36 cores, 7338 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 4556c62c88, stack 4556c62c88 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 3500 | 4900 | 3 ms | 31 ms | 0.00% | 76% | pass |
| coarse 2 | 3780 | 5296 | 4 ms | 17 ms | 0.00% | 83% | pass |
| coarse 3 | 4082 | 5693 | 9 ms | 69 ms | 1.17% | 86% | fail: errors 1.2% |

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
