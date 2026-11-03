# spring / none

Run `spring-none-20261102-072004`, 2026-11-02T07:20:04+01:00 to 2026-11-02T07:37:22+01:00

## The app crashed

App crashed at 1946 sessions/s (ramp-coarse step 14): container exited, killed by the out-of-memory killer, stopped at 2026-11-02T06:36:35.068174123Z.

The run stopped there. Anything below was measured before the crash.

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | - | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.51 s (+0.4% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness b58c287e3f, stack b58c287e3f | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 11 ms | 14 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 22 | 11 ms | 14 ms | 0.00% | 16% | pass |
| coarse 3 | 22 | 31 | 9 ms | 12 ms | 0.00% | 19% | pass |
| coarse 4 | 34 | 48 | 8 ms | 12 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 71 | 8 ms | 11 ms | 0.00% | 26% | pass |
| coarse 6 | 76 | 107 | 8 ms | 11 ms | 0.00% | 35% | pass |
| coarse 7 | 114 | 160 | 8 ms | 12 ms | 0.00% | 47% | pass |
| coarse 8 | 171 | 238 | 7 ms | 11 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 358 | 6 ms | 9 ms | 0.00% | 54% | pass |
| coarse 10 | 384 | 540 | 5 ms | 8 ms | 0.00% | 52% | pass |
| coarse 11 | 577 | 808 | 3 ms | 5 ms | 0.00% | 56% | pass |
| coarse 12 | 865 | 1213 | 2 ms | 4 ms | 0.00% | 59% | pass |
| coarse 13 | 1297 | 1815 | 2 ms | 21 ms | 0.00% | 68% | pass |
| coarse 14 | 1946 | 695 | 2300 ms | 36399 ms | 14.03% | 42% | fail: not judged |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.51 s.
