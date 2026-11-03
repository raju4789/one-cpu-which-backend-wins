# spring / app

Run `spring-app-20261103-071040`, 2026-11-03T07:10:40+01:00 to 2026-11-03T07:30:02+01:00

**Warning:** the Mac compressed 2.2 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on

## The app crashed

App crashed at 4379 sessions/s (ramp-coarse step 16): container exited, killed by the out-of-memory killer, stopped at 2026-11-03T06:29:07.409169021Z.

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
| Core speed (calibration) | 5.50 s (+0.2% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 17b0155dd5, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 14 ms | 0.00% | 8% | pass |
| coarse 2 | 15 | 21 | 10 ms | 15 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 30 | 9 ms | 12 ms | 0.00% | 13% | pass |
| coarse 4 | 34 | 47 | 8 ms | 11 ms | 0.00% | 15% | pass |
| coarse 5 | 51 | 72 | 7 ms | 11 ms | 0.00% | 18% | pass |
| coarse 6 | 76 | 107 | 7 ms | 9 ms | 0.00% | 22% | pass |
| coarse 7 | 114 | 160 | 6 ms | 10 ms | 0.00% | 27% | pass |
| coarse 8 | 171 | 241 | 7 ms | 10 ms | 0.00% | 36% | pass |
| coarse 9 | 256 | 358 | 6 ms | 11 ms | 0.00% | 43% | pass |
| coarse 10 | 384 | 537 | 6 ms | 10 ms | 0.00% | 46% | pass |
| coarse 11 | 577 | 806 | 7 ms | 10 ms | 0.00% | 48% | pass |
| coarse 12 | 865 | 1214 | 6 ms | 9 ms | 0.00% | 49% | pass |
| coarse 13 | 1297 | 1812 | 5 ms | 9 ms | 0.00% | 45% | pass |
| coarse 14 | 1946 | 2726 | 3 ms | 10 ms | 0.00% | 46% | pass |
| coarse 15 | 2919 | 4088 | 3 ms | 62 ms | 0.00% | 67% | pass |
| coarse 16 | 4379 | 1265 | 36383 ms | 39519 ms | 50.39% | 97% | fail: not judged |

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.5 s.
