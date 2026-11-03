# spring / none

Run `spring-none-20261103-080929`, 2026-11-03T08:09:29+01:00 to 2026-11-03T08:26:47+01:00

## The app crashed

App crashed at 1946 sessions/s (ramp-coarse step 14): container exited, killed by the out-of-memory killer, stopped at 2026-11-03T07:26:01.65057672Z.

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
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 17b0155dd5, stack b58c287e3f (spring-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 14 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 10 ms | 14 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 10 ms | 14 ms | 0.00% | 19% | pass |
| coarse 4 | 34 | 48 | 8 ms | 12 ms | 0.00% | 23% | pass |
| coarse 5 | 51 | 71 | 7 ms | 11 ms | 0.00% | 27% | pass |
| coarse 6 | 76 | 108 | 8 ms | 11 ms | 0.00% | 34% | pass |
| coarse 7 | 114 | 160 | 7 ms | 11 ms | 0.00% | 45% | pass |
| coarse 8 | 171 | 238 | 7 ms | 10 ms | 0.00% | 52% | pass |
| coarse 9 | 256 | 359 | 6 ms | 9 ms | 0.00% | 50% | pass |
| coarse 10 | 384 | 538 | 5 ms | 8 ms | 0.00% | 49% | pass |
| coarse 11 | 577 | 808 | 3 ms | 5 ms | 0.00% | 58% | pass |
| coarse 12 | 865 | 1216 | 2 ms | 4 ms | 0.00% | 57% | pass |
| coarse 13 | 1297 | 1814 | 4 ms | 61 ms | 0.00% | 65% | pass |
| coarse 14 | 1946 | 785 | 2117 ms | 36917 ms | 12.34% | 55% | fail: not judged |

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
