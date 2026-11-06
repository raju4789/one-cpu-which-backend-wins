# spring / nginx

Run `spring-nginx-20261104-234006`, 2026-11-04T23:40:06+00:00 to 2026-11-05T00:16:10+00:00

**Warning:** calibration 19.24 s is 250% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **590 req/s** | 422 | 1701 | 2 ms | 53 ms | 756 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 25% | 408 MB |
| bench-cadvisor-1 | 0% | 50 MB |
| bench-nginx-1 | 17% | 44 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 22% | 541 MB |
| bench-postgres-exporter-1 | 1% | 17 MB |
| whole VM | 66% | 1346 MB |

The Mac running k6 peaked at 29% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 29% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.2 cores, 1112 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 19.24 s (+250.5% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 190,339 vs 190,339 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 190,634 vs 190,633 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 43,795 posts stored for 43,567 acknowledged, 130,747 likes for 129,828 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 15 ms | 25 ms | 0.00% | 10% | pass |
| coarse 2 | 15 | 21 | 14 ms | 23 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 14 ms | 21 ms | 0.00% | 14% | pass |
| coarse 4 | 34 | 48 | 15 ms | 30 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 72 | 14 ms | 27 ms | 0.00% | 25% | pass |
| coarse 6 | 76 | 105 | 15 ms | 38 ms | 0.00% | 35% | pass |
| coarse 7 | 114 | 159 | 14 ms | 31 ms | 0.00% | 36% | pass |
| coarse 8 | 171 | 239 | 22 ms | 87 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 357 | 23 ms | 126 ms | 0.00% | 61% | pass |
| coarse 10 | 384 | 538 | 45 ms | 197 ms | 0.00% | 69% | pass |
| coarse 11 | 577 | 806 | 2778 ms | 4251 ms | 1.62% | 96% | fail: p95 2778 ms, p99 4251 ms, errors 1.6% |
| fine 1 | 422 | 592 | 23 ms | 119 ms | 0.00% | 66% | pass |
| fine 2 | 461 | 645 | 1601 ms | 3871 ms | 2.34% | 78% | fail: p95 1601 ms, p99 3871 ms, errors 2.3% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 887 | 796 ms | 1823 ms | 0.92% |
| back at 1x | 592 | 45 ms | 180 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 19.24 s.
