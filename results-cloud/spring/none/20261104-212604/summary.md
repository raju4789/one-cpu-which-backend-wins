# spring / none

Run `spring-none-20261104-212604`, 2026-11-04T21:26:04+00:00 to 2026-11-04T22:02:21+00:00

**Warning:** calibration 24.08 s is 339% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **148 req/s** | 106 | 430 | 8 ms | 74 ms | 968 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 24% | 396 MB |
| bench-cadvisor-1 | 0% | 30 MB |
| bench-nginx-1 | 6% | 34 MB |
| bench-nginx-exporter-1 | 0% | 11 MB |
| bench-postgres-1 | 37% | 464 MB |
| bench-postgres-exporter-1 | 1% | 12 MB |
| whole VM | 71% | 1278 MB |

The Mac running k6 peaked at 11% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 11% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 310 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.08 s (+338.6% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 47,763 vs 47,762 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 47,779 vs 47,779 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 11,433 posts stored for 11,404 acknowledged, 33,973 likes for 33,870 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack b58c287e3f (spring-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 22 ms | 41 ms | 0.00% | 16% | pass |
| coarse 2 | 15 | 21 | 23 ms | 35 ms | 0.00% | 24% | pass |
| coarse 3 | 22 | 31 | 28 ms | 50 ms | 0.00% | 38% | pass |
| coarse 4 | 34 | 47 | 24 ms | 52 ms | 0.00% | 37% | pass |
| coarse 5 | 51 | 70 | 31 ms | 126 ms | 0.00% | 56% | pass |
| coarse 6 | 76 | 107 | 63 ms | 315 ms | 0.00% | 61% | pass |
| coarse 7 | 114 | 160 | 659 ms | 1109 ms | 0.00% | 82% | fail: p95 659 ms, p99 1109 ms |
| fine 1 | 84 | 117 | 25 ms | 53 ms | 0.00% | 60% | pass |
| fine 2 | 91 | 126 | 58 ms | 448 ms | 0.00% | 59% | pass |
| fine 3 | 99 | 139 | 147 ms | 810 ms | 0.00% | 69% | pass |
| fine 4 | 106 | 148 | 62 ms | 566 ms | 0.00% | 70% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 222 | 3308 ms | 4103 ms | 0.00% |
| back at 1x | 148 | 82 ms | 810 ms | 0.00% |

Recovered.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 24.08 s.
