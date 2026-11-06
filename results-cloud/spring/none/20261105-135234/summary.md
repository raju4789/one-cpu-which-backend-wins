# spring / none

Run `spring-none-20261105-135234`, 2026-11-05T13:52:34+00:00 to 2026-11-05T14:26:08+00:00

**Warning:** calibration 24.70 s is 350% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **128 req/s** | 91 | 367 | 11 ms | 60 ms | 155 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 23% | 459 MB |
| bench-cadvisor-1 | 1% | 24 MB |
| bench-nginx-1 | 6% | 32 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 39% | 452 MB |
| bench-postgres-exporter-1 | 1% | 8 MB |
| whole VM | 65% | 1379 MB |

The Mac running k6 peaked at 20% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 20% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 271 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.70 s (+349.9% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 41,267 vs 41,267 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 40,990 vs 40,989 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 9,885 posts stored for 9,811 acknowledged, 29,708 likes for 29,479 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack b58c287e3f (spring-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 20 ms | 44 ms | 0.00% | 17% | pass |
| coarse 2 | 15 | 21 | 33 ms | 61 ms | 0.00% | 27% | pass |
| coarse 3 | 22 | 31 | 25 ms | 46 ms | 0.00% | 39% | pass |
| coarse 4 | 34 | 48 | 45 ms | 132 ms | 0.00% | 44% | pass |
| coarse 5 | 51 | 71 | 43 ms | 131 ms | 0.00% | 57% | pass |
| coarse 6 | 76 | 106 | 171 ms | 733 ms | 0.00% | 61% | pass |
| coarse 7 | 114 | 159 | 5116 ms | 6266 ms | 0.00% | 90% | fail: p95 5116 ms, p99 6266 ms |
| fine 1 | 84 | 118 | 33 ms | 84 ms | 0.00% | 62% | pass |
| fine 2 | 91 | 128 | 71 ms | 271 ms | 0.00% | 57% | pass |
| fine 3 | 99 | 135 | 4264 ms | 5882 ms | 0.00% | 81% | fail: p95 4264 ms, p99 5882 ms, k6 dropped 3.4% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 191 | 2122 ms | 3345 ms | 0.00% |
| back at 1x | 127 | 38 ms | 66 ms | 0.00% |

Recovered.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 24.7 s.
