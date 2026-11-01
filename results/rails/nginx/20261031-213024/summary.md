# rails / nginx

Run `rails-nginx-20261031-213024`, 2026-10-31T21:30:25+01:00 to 2026-10-31T22:17:59+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **3545 req/s** | 2530 | 10125 | 0 ms | 4 ms | 29 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 41% | 125 MB |
| bench-cadvisor-1 | 0% | 36 MB |
| bench-nginx-1 | 13% | 68 MB |
| bench-nginx-exporter-1 | 0% | 9 MB |
| bench-postgres-1 | 18% | 648 MB |
| bench-postgres-exporter-1 | 0% | 11 MB |
| whole VM | 74% | 1348 MB |

The Mac running k6 peaked at 22% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 22% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.75 cores, 6459 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,142,669 vs 1,142,669 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 700,176 vs 693,623 (+0.94%) | within 2% | ok |
| Writes stored (data check) | 321,622 posts stored for 321,575 acknowledged, 955,350 likes for 955,842 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 82ea35c4d5, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 10 ms | 0.00% | 5% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 32 | 8 ms | 10 ms | 0.00% | 8% | pass |
| coarse 4 | 34 | 48 | 7 ms | 10 ms | 0.00% | 11% | pass |
| coarse 5 | 51 | 72 | 8 ms | 12 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 106 | 8 ms | 12 ms | 0.00% | 21% | pass |
| coarse 7 | 114 | 159 | 9 ms | 13 ms | 0.00% | 26% | pass |
| coarse 8 | 171 | 238 | 9 ms | 14 ms | 0.00% | 37% | pass |
| coarse 9 | 256 | 359 | 8 ms | 12 ms | 0.00% | 42% | pass |
| coarse 10 | 384 | 537 | 7 ms | 11 ms | 0.00% | 41% | pass |
| coarse 11 | 577 | 810 | 5 ms | 10 ms | 0.00% | 41% | pass |
| coarse 12 | 865 | 1210 | 4 ms | 7 ms | 0.00% | 45% | pass |
| coarse 13 | 1297 | 1814 | 3 ms | 5 ms | 0.00% | 48% | pass |
| coarse 14 | 1946 | 2731 | 3 ms | 7 ms | 0.00% | 55% | pass |
| coarse 15 | 2919 | 3178 | 1527 ms | 25831 ms | 1.29% | 95% | fail: p95 1527 ms, p99 25831 ms, errors 1.3%, k6 dropped 17.2% of sessions |
| fine 1 | 2141 | 2991 | 3 ms | 7 ms | 0.00% | 62% | pass |
| fine 2 | 2335 | 3261 | 3 ms | 7 ms | 0.00% | 62% | pass |
| fine 3 | 2530 | 3542 | 7 ms | 230 ms | 0.00% | 81% | pass |
| fine 4 | 2724 | 3814 | 6 ms | 58 ms | 0.00% | 85% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2325 | 44715 ms | 60001 ms | 6.94% |
| back at 1x | 2555 | 17942 ms | 60000 ms | 4.16% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
