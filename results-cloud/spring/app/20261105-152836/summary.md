# spring / app

Run `spring-app-20261105-152836`, 2026-11-05T15:28:36+00:00 to 2026-11-05T16:14:15+00:00

**Warning:** calibration 24.61 s is 348% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **430 req/s** | 307 | 1234 | 8 ms | 50 ms | 95 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 36% | 400 MB |
| bench-cadvisor-1 | 1% | 24 MB |
| bench-nginx-1 | 16% | 37 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 20% | 481 MB |
| bench-postgres-exporter-1 | 1% | 8 MB |
| whole VM | 68% | 1317 MB |

The Mac running k6 peaked at 28% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 28% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.8 cores, 815 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.61 s (+348.3% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 138,780 vs 138,779 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 138,753 vs 138,752 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 45,391 posts stored for 45,346 acknowledged, 136,884 likes for 136,721 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 19 ms | 44 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 24 ms | 42 ms | 0.00% | 21% | pass |
| coarse 3 | 22 | 31 | 22 ms | 42 ms | 0.00% | 25% | pass |
| coarse 4 | 34 | 47 | 23 ms | 45 ms | 0.00% | 27% | pass |
| coarse 5 | 51 | 71 | 26 ms | 84 ms | 0.00% | 37% | pass |
| coarse 6 | 76 | 106 | 36 ms | 80 ms | 0.00% | 42% | pass |
| coarse 7 | 114 | 160 | 41 ms | 247 ms | 0.00% | 49% | pass |
| coarse 8 | 171 | 239 | 296 ms | 638 ms | 0.00% | 61% | pass |
| coarse 9 | 256 | 358 | 131 ms | 785 ms | 0.00% | 74% | pass |
| coarse 10 | 384 | 539 | 438 ms | 1240 ms | 0.01% | 87% | fail: p95 438 ms, p99 1240 ms |
| fine 1 | 282 | 395 | 60 ms | 127 ms | 0.00% | 69% | pass |
| fine 2 | 307 | 430 | 125 ms | 436 ms | 0.00% | 69% | pass |
| fine 3 | 333 | 469 | 163 ms | 703 ms | 0.00% | 85% | pass |
| fine 4 | 358 | 501 | 347 ms | 590 ms | 0.00% | 74% | fail: p95 347 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 646 | 1489 ms | 1896 ms | 1.35% |
| back at 1x | 430 | 1319 ms | 1939 ms | 0.33% |

Did not recover within 2 minutes.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 24.61 s.
