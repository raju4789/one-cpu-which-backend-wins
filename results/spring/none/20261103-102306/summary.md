# spring / none

Run `spring-none-20261103-102306`, 2026-11-03T10:23:06+01:00 to 2026-11-03T10:40:24+01:00

## The app crashed

App crashed at 1946 sessions/s (ramp-coarse step 14): container exited, killed by the out-of-memory killer, stopped at 2026-11-03T09:39:38.513402394Z.

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
| coarse 1 | 10 | 14 | 11 ms | 15 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 9 ms | 13 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 9 ms | 13 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 48 | 8 ms | 12 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 71 | 8 ms | 11 ms | 0.00% | 27% | pass |
| coarse 6 | 76 | 107 | 8 ms | 11 ms | 0.00% | 37% | pass |
| coarse 7 | 114 | 161 | 7 ms | 12 ms | 0.00% | 42% | pass |
| coarse 8 | 171 | 242 | 7 ms | 10 ms | 0.00% | 47% | pass |
| coarse 9 | 256 | 359 | 6 ms | 9 ms | 0.00% | 54% | pass |
| coarse 10 | 384 | 535 | 5 ms | 8 ms | 0.00% | 52% | pass |
| coarse 11 | 577 | 808 | 3 ms | 5 ms | 0.00% | 59% | pass |
| coarse 12 | 865 | 1210 | 2 ms | 4 ms | 0.00% | 58% | pass |
| coarse 13 | 1297 | 1818 | 3 ms | 61 ms | 0.00% | 62% | pass |
| coarse 14 | 1946 | 717 | 2348 ms | 38656 ms | 13.04% | 49% | fail: not judged |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
