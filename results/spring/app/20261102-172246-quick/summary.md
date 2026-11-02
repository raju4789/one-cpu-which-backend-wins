# spring / app (quick run, for tuning only)

Run `spring-app-20261102-172246`, 2026-11-02T17:22:46+01:00 to 2026-11-02T17:31:51+01:00

## The app crashed

App crashed at 4408 sessions/s (ramp-quick step 6): container exited, killed by the out-of-memory killer, stopped at 2026-11-02T16:30:53.080672415Z.

The run stopped there. Anything below was measured before the crash.

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 2.09 cores, 7509 MB | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.48 s (-0.2% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 22d0e4c43f, stack 22d0e4c43f | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 3000 | 4201 | 2 ms | 4 ms | 0.00% | 64% | pass |
| coarse 2 | 3240 | 4541 | 2 ms | 5 ms | 0.00% | 75% | pass |
| coarse 3 | 3499 | 4903 | 3 ms | 7 ms | 0.00% | 76% | pass |
| coarse 4 | 3779 | 5283 | 4 ms | 49 ms | 0.01% | 77% | pass |
| coarse 5 | 4081 | 5713 | 78 ms | 145 ms | 0.10% | 84% | pass |
| coarse 6 | 4408 | 542 | 37053 ms | 37905 ms | 52.56% | 41% | fail: not judged |

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.48 s.
