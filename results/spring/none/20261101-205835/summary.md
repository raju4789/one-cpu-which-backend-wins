# spring / none

Run `spring-none-20261101-205835`, 2026-11-01T20:58:35+01:00 to 2026-11-01T21:35:10+01:00

**Warning:** confirm-1297: Nginx counted 57059 requests but k6 recorded 48756 (+17.0%). One of them is wrong, most likely k6: don't trust this test's numbers

**Warning:** confirm-865: Nginx counted 39565 requests but k6 recorded 34236 (+15.6%). One of them is wrong, most likely k6: don't trust this test's numbers

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
| Writes stored (data check) | 26,694 posts stored for 26,694 acknowledged, 80,418 likes for 80,420 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness dfc3f37fda, stack dfc3f37fda | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 12 ms | 15 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 10 ms | 16 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 9 ms | 12 ms | 0.00% | 21% | pass |
| coarse 4 | 34 | 47 | 8 ms | 12 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 71 | 8 ms | 11 ms | 0.00% | 27% | pass |
| coarse 6 | 76 | 106 | 8 ms | 11 ms | 0.00% | 36% | pass |
| coarse 7 | 114 | 159 | 7 ms | 11 ms | 0.00% | 47% | pass |
| coarse 8 | 171 | 239 | 7 ms | 10 ms | 0.00% | 52% | pass |
| coarse 9 | 256 | 360 | 5 ms | 9 ms | 0.00% | 53% | pass |
| coarse 10 | 384 | 538 | 5 ms | 8 ms | 0.00% | 54% | pass |
| coarse 11 | 577 | 808 | 3 ms | 5 ms | 0.00% | 60% | pass |
| coarse 12 | 865 | 1211 | 2 ms | 5 ms | 0.00% | 61% | pass |
| coarse 13 | 1297 | 1812 | 2 ms | 11 ms | 0.00% | 63% | pass |
| coarse 14 | 1946 | 742 | 2295 ms | 20969 ms | 11.78% | 55% | fail: p95 2295 ms, p99 20969 ms, errors 11.8%, k6 dropped 68.9% of sessions |
| fine 1 | 1427 | 7 | 39166 ms | 41021 ms | 100.00% | 6% | fail: p95 39166 ms, p99 41021 ms, errors 100.0%, k6 dropped 99.5% of sessions |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
