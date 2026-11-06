# spring / none

Run `spring-none-20261105-054344`, 2026-11-05T05:43:44+00:00 to 2026-11-05T06:17:14+00:00

**Warning:** calibration 24.52 s is 347% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **128 req/s** | 91 | 366 | 12 ms | 48 ms | 86 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 24% | 462 MB |
| bench-cadvisor-1 | 1% | 24 MB |
| bench-nginx-1 | 6% | 32 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 39% | 458 MB |
| bench-postgres-exporter-1 | 1% | 7 MB |
| whole VM | 63% | 1367 MB |

The Mac running k6 peaked at 15% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 15% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 272 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.52 s (+346.6% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 41,170 vs 41,169 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 41,303 vs 41,302 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 9,895 posts stored for 9,810 acknowledged, 29,869 likes for 29,643 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack b58c287e3f (spring-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 32 ms | 53 ms | 0.00% | 18% | pass |
| coarse 2 | 15 | 21 | 28 ms | 45 ms | 0.00% | 28% | pass |
| coarse 3 | 22 | 31 | 25 ms | 40 ms | 0.00% | 34% | pass |
| coarse 4 | 34 | 48 | 39 ms | 83 ms | 0.00% | 46% | pass |
| coarse 5 | 51 | 71 | 30 ms | 57 ms | 0.00% | 52% | pass |
| coarse 6 | 76 | 106 | 103 ms | 357 ms | 0.00% | 65% | pass |
| coarse 7 | 114 | 160 | 4552 ms | 5690 ms | 0.00% | 90% | fail: p95 4552 ms, p99 5690 ms |
| fine 1 | 84 | 118 | 36 ms | 66 ms | 0.00% | 55% | pass |
| fine 2 | 91 | 126 | 196 ms | 461 ms | 0.00% | 69% | pass |
| fine 3 | 99 | 131 | 5219 ms | 7121 ms | 0.00% | 76% | fail: p95 5219 ms, p99 7121 ms, k6 dropped 5.2% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 193 | 2497 ms | 3482 ms | 0.00% |
| back at 1x | 128 | 1016 ms | 2673 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 24.52 s.
