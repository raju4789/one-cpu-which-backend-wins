# spring / app

Run `spring-app-20261105-071044`, 2026-11-05T07:10:44+00:00 to 2026-11-05T07:46:51+00:00

**Warning:** calibration 20.54 s is 274% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **592 req/s** | 422 | 1701 | 8 ms | 87 ms | 187 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 39% | 488 MB |
| bench-cadvisor-1 | 1% | 39 MB |
| bench-nginx-1 | 16% | 38 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 22% | 498 MB |
| bench-postgres-exporter-1 | 1% | 9 MB |
| whole VM | 79% | 1380 MB |

The Mac running k6 peaked at 30% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 30% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.2 cores, 1102 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.54 s (+274.1% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 190,697 vs 190,696 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 185,553 vs 185,554 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 43,144 posts stored for 42,916 acknowledged, 129,646 likes for 128,852 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 14 ms | 29 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 18 ms | 43 ms | 0.00% | 24% | pass |
| coarse 3 | 22 | 31 | 14 ms | 31 ms | 0.00% | 19% | pass |
| coarse 4 | 34 | 48 | 15 ms | 35 ms | 0.00% | 26% | pass |
| coarse 5 | 51 | 71 | 15 ms | 31 ms | 0.00% | 34% | pass |
| coarse 6 | 76 | 106 | 13 ms | 27 ms | 0.00% | 33% | pass |
| coarse 7 | 114 | 159 | 11 ms | 22 ms | 0.00% | 40% | pass |
| coarse 8 | 171 | 239 | 49 ms | 188 ms | 0.00% | 55% | pass |
| coarse 9 | 256 | 358 | 26 ms | 60 ms | 0.00% | 67% | pass |
| coarse 10 | 384 | 537 | 84 ms | 410 ms | 0.00% | 81% | pass |
| coarse 11 | 577 | 809 | 4222 ms | 4685 ms | 1.14% | 94% | fail: p95 4222 ms, p99 4685 ms, errors 1.1% |
| fine 1 | 422 | 589 | 139 ms | 313 ms | 0.00% | 72% | pass |
| fine 2 | 461 | 645 | 404 ms | 1185 ms | 0.08% | 89% | fail: p95 404 ms, p99 1185 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 841 | 4576 ms | 5581 ms | 2.17% |
| back at 1x | 591 | 90 ms | 280 ms | 0.00% |

Recovered.

Idle baseline: the VM used 8% of the core with no load (monitoring agents and Postgres).
Calibration: 20.54 s.
