# spring / nginx (quick run, for tuning only)

Run `spring-nginx-20261102-205924`, 2026-11-02T20:59:24+01:00 to 2026-11-02T21:04:34+01:00

## The app crashed

App crashed at 4752 sessions/s (ramp-quick step 2): container exited, killed by the out-of-memory killer, stopped at 2026-11-02T20:03:53.205947501Z.

The run stopped there. Anything below was measured before the crash.

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 3.38 cores, 9850 MB | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 4556c62c88, stack 4556c62c88 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 4400 | 6154 | 21 ms | 120 ms | 0.26% | 90% | pass |
| coarse 2 | 4752 | 2944 | 4934 ms | 15951 ms | 30.99% | 99% | fail: not judged |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
