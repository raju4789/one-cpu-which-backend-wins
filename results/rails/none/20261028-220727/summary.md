# rails / none

Run `rails-none-20261028-220727`, 2026-10-28T22:07:27+01:00 to 2026-10-28T22:43:52+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1132 req/s** | 808 | 3235 | 1 ms | 13 ms | 52 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 49% | 131 MB |
| bench-cadvisor-1 | 0% | 43 MB |
| bench-nginx-1 | 4% | 46 MB |
| bench-nginx-exporter-1 | 0% | 16 MB |
| bench-postgres-1 | 26% | 572 MB |
| bench-postgres-exporter-1 | 0% | 19 MB |
| whole VM | 83% | 1311 MB |

The Mac running k6 peaked at 18% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 18% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.71 cores, 2082 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 364,892 vs 364,892 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 263,097 vs 260,733 (+0.91%) | within 2% | ok |
| Writes stored (data check) | 76,524 posts stored for 76,521 acknowledged, 225,411 likes for 225,387 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 13 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 11 ms | 15 ms | 0.00% | 15% | pass |
| coarse 3 | 22 | 30 | 11 ms | 16 ms | 0.00% | 21% | pass |
| coarse 4 | 34 | 47 | 11 ms | 14 ms | 0.00% | 30% | pass |
| coarse 5 | 51 | 72 | 12 ms | 15 ms | 0.00% | 39% | pass |
| coarse 6 | 76 | 106 | 10 ms | 15 ms | 0.00% | 47% | pass |
| coarse 7 | 114 | 160 | 9 ms | 12 ms | 0.00% | 49% | pass |
| coarse 8 | 171 | 239 | 7 ms | 11 ms | 0.00% | 54% | pass |
| coarse 9 | 256 | 357 | 5 ms | 7 ms | 0.00% | 58% | pass |
| coarse 10 | 384 | 538 | 3 ms | 5 ms | 0.00% | 62% | pass |
| coarse 11 | 577 | 804 | 3 ms | 5 ms | 0.00% | 58% | pass |
| coarse 12 | 865 | 1214 | 488 ms | 544 ms | 0.00% | 86% | fail: p95 488 ms |
| fine 1 | 635 | 891 | 3 ms | 7 ms | 0.00% | 68% | pass |
| fine 2 | 692 | 968 | 3 ms | 20 ms | 0.00% | 70% | pass |
| fine 3 | 750 | 1054 | 4 ms | 14 ms | 0.00% | 73% | pass |
| fine 4 | 808 | 1132 | 22 ms | 98 ms | 0.00% | 85% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 965 | 60000 ms | 60000 ms | 7.90% |
| back at 1x | 953 | 32703 ms | 60000 ms | 6.33% |

Did not recover within 2 minutes.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
