# spring / nginx

Run `spring-nginx-20261103-074003`, 2026-11-03T07:40:03+01:00 to 2026-11-03T07:59:28+01:00

## The app crashed

App crashed at 4379 sessions/s (ramp-coarse step 16): container exited, killed by the out-of-memory killer, stopped at 2026-11-03T06:58:34.294970342Z.

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
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 17b0155dd5, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 12 ms | 17 ms | 0.00% | 7% | pass |
| coarse 2 | 15 | 21 | 12 ms | 15 ms | 0.00% | 9% | pass |
| coarse 3 | 22 | 31 | 10 ms | 16 ms | 0.00% | 11% | pass |
| coarse 4 | 34 | 48 | 9 ms | 14 ms | 0.00% | 14% | pass |
| coarse 5 | 51 | 71 | 8 ms | 12 ms | 0.00% | 18% | pass |
| coarse 6 | 76 | 106 | 8 ms | 12 ms | 0.00% | 22% | pass |
| coarse 7 | 114 | 159 | 7 ms | 10 ms | 0.00% | 24% | pass |
| coarse 8 | 171 | 240 | 7 ms | 12 ms | 0.00% | 32% | pass |
| coarse 9 | 256 | 360 | 7 ms | 12 ms | 0.00% | 40% | pass |
| coarse 10 | 384 | 538 | 6 ms | 11 ms | 0.00% | 44% | pass |
| coarse 11 | 577 | 805 | 7 ms | 11 ms | 0.00% | 43% | pass |
| coarse 12 | 865 | 1209 | 6 ms | 10 ms | 0.00% | 44% | pass |
| coarse 13 | 1297 | 1820 | 6 ms | 10 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2722 | 3 ms | 6 ms | 0.00% | 45% | pass |
| coarse 15 | 2919 | 4084 | 3 ms | 16 ms | 0.00% | 55% | pass |
| coarse 16 | 4379 | 1503 | 34995 ms | 37566 ms | 35.08% | 79% | fail: not judged |

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
