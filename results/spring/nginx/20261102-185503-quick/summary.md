# spring / nginx (quick run, for tuning only)

Run `spring-nginx-20261102-185503`, 2026-11-02T18:55:03+01:00 to 2026-11-02T18:59:13+01:00

## The app crashed

App crashed at 4800 sessions/s (ramp-quick step 1): container exited, killed by the out-of-memory killer, stopped at 2026-11-02T17:58:37.425844424Z.

The run stopped there. Anything below was measured before the crash.

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 3.18 cores, 9389 MB | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 51f3535c33, stack 51f3535c33 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 4800 | 3401 | 3089 ms | 10893 ms | 9.94% | 97% | fail: not judged |

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
