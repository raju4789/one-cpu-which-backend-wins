# spring / none

Run `spring-none-20261105-195947`, 2026-11-05T19:59:47+00:00 to 2026-11-05T20:35:18+00:00

**Warning:** calibration 22.53 s is 310% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **148 req/s** | 106 | 429 | 11 ms | 107 ms | 387 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 26% | 335 MB |
| bench-cadvisor-1 | 1% | 29 MB |
| bench-nginx-1 | 6% | 34 MB |
| bench-nginx-exporter-1 | 0% | 10 MB |
| bench-postgres-1 | 40% | 485 MB |
| bench-postgres-exporter-1 | 1% | 11 MB |
| whole VM | 69% | 1102 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.6 cores, 310 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 22.53 s (+310.4% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 47,789 vs 47,789 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 8,017 posts stored for 7,987 acknowledged, 23,737 likes for 23,672 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 23e996cb98, stack 23e996cb98 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 24 ms | 45 ms | 0.00% | 16% | pass |
| coarse 2 | 15 | 21 | 29 ms | 50 ms | 0.00% | 23% | pass |
| coarse 3 | 22 | 31 | 25 ms | 67 ms | 0.00% | 29% | pass |
| coarse 4 | 34 | 47 | 20 ms | 46 ms | 0.00% | 36% | pass |
| coarse 5 | 51 | 71 | 27 ms | 84 ms | 0.00% | 54% | pass |
| coarse 6 | 76 | 105 | 48 ms | 349 ms | 0.00% | 60% | pass |
| coarse 7 | 114 | 159 | 570 ms | 895 ms | 0.00% | 84% | fail: p95 570 ms |
| fine 1 | 84 | 118 | 64 ms | 159 ms | 0.00% | 63% | pass |
| fine 2 | 91 | 127 | 125 ms | 527 ms | 0.00% | 68% | pass |
| fine 3 | 99 | 139 | 76 ms | 490 ms | 0.00% | 62% | pass |
| fine 4 | 106 | 149 | 76 ms | 371 ms | 0.00% | 70% | pass |

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 22.53 s.
