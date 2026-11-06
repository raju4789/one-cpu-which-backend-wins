# rails / none

Run `rails-none-20261105-113532`, 2026-11-05T11:35:32+00:00 to 2026-11-05T12:07:54+00:00

**Warning:** calibration 20.83 s is 279% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **92 req/s** | 66 | 267 | 20 ms | 142 ms | 417 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 44% | 155 MB |
| bench-cadvisor-1 | 1% | 23 MB |
| bench-nginx-1 | 5% | 32 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 30% | 433 MB |
| bench-postgres-exporter-1 | 1% | 9 MB |
| whole VM | 75% | 917 MB |

The Mac running k6 peaked at 13% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 13% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 208 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.83 s (+279.4% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 29,691 vs 29,690 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 28,283 vs 28,282 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 7,171 posts stored for 7,170 acknowledged, 21,618 likes for 21,617 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 25 ms | 35 ms | 0.00% | 15% | pass |
| coarse 2 | 15 | 21 | 30 ms | 164 ms | 0.00% | 24% | pass |
| coarse 3 | 22 | 31 | 31 ms | 84 ms | 0.00% | 32% | pass |
| coarse 4 | 34 | 48 | 56 ms | 263 ms | 0.00% | 46% | pass |
| coarse 5 | 51 | 72 | 227 ms | 408 ms | 0.00% | 64% | pass |
| coarse 6 | 76 | 106 | 2109 ms | 2277 ms | 0.00% | 91% | fail: p95 2109 ms, p99 2277 ms |
| fine 1 | 56 | 79 | 48 ms | 92 ms | 0.00% | 65% | pass |
| fine 2 | 61 | 84 | 194 ms | 500 ms | 0.00% | 65% | pass |
| fine 3 | 66 | 94 | 212 ms | 530 ms | 0.00% | 77% | pass |
| fine 4 | 71 | 100 | 371 ms | 474 ms | 0.00% | 83% | fail: p95 371 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 125 | 3475 ms | 3833 ms | 0.00% |
| back at 1x | 93 | 301 ms | 1374 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 20.83 s.
