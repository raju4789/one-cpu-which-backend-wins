# spring / none

Run `spring-none-20261105-143608`, 2026-11-05T14:36:08+00:00 to 2026-11-05T15:18:36+00:00

**Warning:** calibration 24.69 s is 350% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **138 req/s** | 99 | 401 | 17 ms | 104 ms | 234 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 24% | 379 MB |
| bench-cadvisor-1 | 1% | 25 MB |
| bench-nginx-1 | 7% | 34 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 45% | 476 MB |
| bench-postgres-exporter-1 | 1% | 9 MB |
| whole VM | 69% | 1257 MB |

The Mac running k6 peaked at 15% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 15% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 294 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.69 s (+349.7% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 44,675 vs 44,674 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 43,672 vs 43,672 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 13,896 posts stored for 13,862 acknowledged, 40,743 likes for 40,653 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 31 ms | 52 ms | 0.00% | 16% | pass |
| coarse 2 | 15 | 22 | 33 ms | 72 ms | 0.00% | 27% | pass |
| coarse 3 | 22 | 31 | 24 ms | 39 ms | 0.00% | 33% | pass |
| coarse 4 | 34 | 48 | 90 ms | 207 ms | 0.00% | 46% | pass |
| coarse 5 | 51 | 70 | 54 ms | 93 ms | 0.00% | 63% | pass |
| coarse 6 | 76 | 106 | 99 ms | 371 ms | 0.00% | 61% | pass |
| coarse 7 | 114 | 159 | 1389 ms | 1559 ms | 0.00% | 80% | fail: p95 1389 ms, p99 1559 ms |
| fine 1 | 84 | 117 | 72 ms | 214 ms | 0.00% | 63% | pass |
| fine 2 | 91 | 126 | 117 ms | 391 ms | 0.00% | 62% | pass |
| fine 3 | 99 | 138 | 167 ms | 520 ms | 0.00% | 70% | pass |
| fine 4 | 106 | 148 | 149 ms | 565 ms | 0.00% | 72% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 199 | 5164 ms | 5853 ms | 21.73% |
| back at 1x | 139 | 63 ms | 112 ms | 0.00% |

Recovered.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 24.69 s.
