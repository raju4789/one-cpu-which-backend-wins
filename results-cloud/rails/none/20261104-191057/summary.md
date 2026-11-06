# rails / none

Run `rails-none-20261104-191057`, 2026-11-04T19:10:57+00:00 to 2026-11-04T19:48:57+00:00

**Warning:** calibration 20.51 s is 274% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **99 req/s** | 71 | 286 | 14 ms | 89 ms | 165 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 43% | 112 MB |
| bench-cadvisor-1 | 0% | 48 MB |
| bench-nginx-1 | 4% | 35 MB |
| bench-nginx-exporter-1 | 0% | 18 MB |
| bench-postgres-1 | 28% | 451 MB |
| bench-postgres-exporter-1 | 1% | 18 MB |
| whole VM | 76% | 998 MB |

The Mac running k6 peaked at 12% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 12% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 218 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.51 s (+273.6% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 32,010 vs 32,010 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 29,013 vs 29,012 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 7,419 posts stored for 7,417 acknowledged, 22,279 likes for 22,278 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 16 ms | 28 ms | 0.00% | 14% | pass |
| coarse 2 | 15 | 21 | 23 ms | 34 ms | 0.00% | 24% | pass |
| coarse 3 | 22 | 30 | 21 ms | 46 ms | 0.00% | 28% | pass |
| coarse 4 | 34 | 48 | 51 ms | 118 ms | 0.00% | 45% | pass |
| coarse 5 | 51 | 72 | 49 ms | 432 ms | 0.00% | 63% | pass |
| coarse 6 | 76 | 106 | 2381 ms | 2740 ms | 0.00% | 92% | fail: p95 2381 ms, p99 2740 ms |
| fine 1 | 56 | 78 | 64 ms | 105 ms | 0.00% | 61% | pass |
| fine 2 | 61 | 86 | 131 ms | 376 ms | 0.00% | 66% | pass |
| fine 3 | 66 | 92 | 146 ms | 503 ms | 0.00% | 73% | pass |
| fine 4 | 71 | 99 | 264 ms | 590 ms | 0.00% | 80% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 122 | 4151 ms | 4938 ms | 0.00% |
| back at 1x | 99 | 248 ms | 1388 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 20.51 s.
