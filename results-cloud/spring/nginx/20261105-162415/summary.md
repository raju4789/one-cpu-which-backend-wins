# spring / nginx

Run `spring-nginx-20261105-162415`, 2026-11-05T16:24:16+00:00 to 2026-11-05T16:59:53+00:00

**Warning:** calibration 24.04 s is 338% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **394 req/s** | 282 | 1132 | 5 ms | 46 ms | 131 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 22% | 369 MB |
| bench-cadvisor-1 | 1% | 43 MB |
| bench-nginx-1 | 18% | 38 MB |
| bench-nginx-exporter-1 | 0% | 13 MB |
| bench-postgres-1 | 21% | 507 MB |
| bench-postgres-exporter-1 | 1% | 14 MB |
| whole VM | 55% | 1233 MB |

The Mac running k6 peaked at 31% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 31% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.0 cores, 752 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.04 s (+337.9% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 127,083 vs 127,083 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 127,233 vs 127,232 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 29,479 posts stored for 29,354 acknowledged, 88,588 likes for 88,132 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 26 ms | 43 ms | 0.00% | 13% | pass |
| coarse 2 | 15 | 20 | 19 ms | 33 ms | 0.00% | 16% | pass |
| coarse 3 | 22 | 31 | 21 ms | 38 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 47 | 23 ms | 51 ms | 0.00% | 24% | pass |
| coarse 5 | 51 | 71 | 21 ms | 36 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 107 | 31 ms | 127 ms | 0.00% | 46% | pass |
| coarse 7 | 114 | 161 | 26 ms | 61 ms | 0.00% | 42% | pass |
| coarse 8 | 171 | 239 | 31 ms | 83 ms | 0.00% | 56% | pass |
| coarse 9 | 256 | 359 | 44 ms | 230 ms | 0.00% | 65% | pass |
| coarse 10 | 384 | 537 | 225 ms | 1360 ms | 0.00% | 75% | fail: p99 1360 ms |
| fine 1 | 282 | 394 | 48 ms | 138 ms | 0.00% | 62% | pass |
| fine 2 | 307 | 428 | 881 ms | 1488 ms | 0.00% | 74% | fail: p95 881 ms, p99 1488 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 592 | 109 ms | 383 ms | 0.00% |
| back at 1x | 394 | 40 ms | 309 ms | 0.00% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 24.04 s.
