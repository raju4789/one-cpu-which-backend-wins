# spring / none

Run `spring-none-20261103-055403`, 2026-11-03T05:54:03+01:00 to 2026-11-03T06:12:02+01:00

## The app crashed

App crashed at 1946 sessions/s (ramp-coarse step 14): container exited, killed by the out-of-memory killer, stopped at 2026-11-03T05:11:15.304207468Z.

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
| Core speed (calibration) | 5.54 s (+0.9% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 17b0155dd5, stack b58c287e3f (spring-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 11 ms | 15 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 11 ms | 14 ms | 0.00% | 15% | pass |
| coarse 3 | 22 | 30 | 9 ms | 14 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 47 | 8 ms | 13 ms | 0.00% | 21% | pass |
| coarse 5 | 51 | 71 | 8 ms | 12 ms | 0.00% | 27% | pass |
| coarse 6 | 76 | 107 | 7 ms | 11 ms | 0.00% | 34% | pass |
| coarse 7 | 114 | 159 | 8 ms | 12 ms | 0.00% | 47% | pass |
| coarse 8 | 171 | 239 | 7 ms | 10 ms | 0.00% | 52% | pass |
| coarse 9 | 256 | 358 | 6 ms | 8 ms | 0.00% | 54% | pass |
| coarse 10 | 384 | 538 | 5 ms | 8 ms | 0.00% | 54% | pass |
| coarse 11 | 577 | 807 | 3 ms | 5 ms | 0.00% | 61% | pass |
| coarse 12 | 865 | 1209 | 2 ms | 6 ms | 0.00% | 58% | pass |
| coarse 13 | 1297 | 1816 | 2 ms | 25 ms | 0.00% | 67% | pass |
| coarse 14 | 1946 | 711 | 2320 ms | 36896 ms | 12.90% | 52% | fail: not judged |

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.54 s.
