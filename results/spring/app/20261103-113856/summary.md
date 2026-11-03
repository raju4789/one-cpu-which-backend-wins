# spring / app

Run `spring-app-20261103-113856`, 2026-11-03T11:38:56+01:00 to 2026-11-03T11:57:17+01:00

## The app crashed

App crashed at 2919 sessions/s (ramp-coarse step 15): container exited, killed by the out-of-memory killer, stopped at 2026-11-03T10:57:15.909409751Z.

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
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 17b0155dd5, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 15 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 11 ms | 14 ms | 0.00% | 11% | pass |
| coarse 3 | 22 | 31 | 9 ms | 14 ms | 0.00% | 13% | pass |
| coarse 4 | 34 | 48 | 8 ms | 11 ms | 0.00% | 15% | pass |
| coarse 5 | 51 | 70 | 7 ms | 10 ms | 0.00% | 18% | pass |
| coarse 6 | 76 | 106 | 7 ms | 10 ms | 0.00% | 21% | pass |
| coarse 7 | 114 | 159 | 6 ms | 10 ms | 0.00% | 27% | pass |
| coarse 8 | 171 | 239 | 7 ms | 10 ms | 0.00% | 35% | pass |
| coarse 9 | 256 | 357 | 6 ms | 10 ms | 0.00% | 44% | pass |
| coarse 10 | 384 | 538 | 6 ms | 10 ms | 0.00% | 45% | pass |
| coarse 11 | 577 | 808 | 7 ms | 11 ms | 0.00% | 47% | pass |
| coarse 12 | 865 | 1208 | 6 ms | 9 ms | 0.00% | 49% | pass |
| coarse 13 | 1297 | 1817 | 5 ms | 9 ms | 0.00% | 50% | pass |
| coarse 14 | 1946 | 2725 | 3 ms | 9 ms | 0.00% | 50% | pass |
| coarse 15 | 2919 | 4088 | 5 ms | 149 ms | 0.01% | 69% | fail: not judged |

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
