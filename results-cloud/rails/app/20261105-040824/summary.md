# rails / app

Run `rails-app-20261105-040824`, 2026-11-05T04:08:24+00:00 to 2026-11-05T04:50:03+00:00

**Warning:** calibration 20.72 s is 277% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **239 req/s** | 171 | 690 | 10 ms | 72 ms | 139 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 51% | 128 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 9% | 34 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 13% | 443 MB |
| bench-postgres-exporter-1 | 1% | 7 MB |
| whole VM | 74% | 917 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.6 cores, 476 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.72 s (+277.4% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 77,217 vs 77,216 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 71,544 vs 71,543 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 23,478 posts stored for 23,469 acknowledged, 70,183 likes for 70,161 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 12 ms | 21 ms | 0.00% | 15% | pass |
| coarse 2 | 15 | 21 | 15 ms | 24 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 14 ms | 32 ms | 0.00% | 21% | pass |
| coarse 4 | 34 | 48 | 15 ms | 23 ms | 0.00% | 23% | pass |
| coarse 5 | 51 | 72 | 16 ms | 27 ms | 0.00% | 32% | pass |
| coarse 6 | 76 | 107 | 17 ms | 32 ms | 0.00% | 42% | pass |
| coarse 7 | 114 | 160 | 186 ms | 726 ms | 0.00% | 60% | pass |
| coarse 8 | 171 | 239 | 127 ms | 507 ms | 0.00% | 79% | pass |
| coarse 9 | 256 | 250 | 4913 ms | 5236 ms | 0.00% | 98% | fail: p95 4913 ms, p99 5236 ms |
| fine 1 | 188 | 265 | 146 ms | 288 ms | 0.00% | 79% | pass |
| fine 2 | 205 | 287 | 557 ms | 884 ms | 0.00% | 91% | fail: p95 557 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 311 | 3960 ms | 6789 ms | 0.00% |
| back at 1x | 238 | 1378 ms | 2324 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 11% of the core with no load (monitoring agents and Postgres).
Calibration: 20.72 s.
