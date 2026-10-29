# rails / none

Run `rails-none-20261028-195208`, 2026-10-28T19:52:08+01:00 to 2026-10-28T20:26:40+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1211 req/s** | 865 | 3476 | 2 ms | 112 ms | 171 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 54% | 133 MB |
| bench-cadvisor-1 | 0% | 24 MB |
| bench-nginx-1 | 5% | 50 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 28% | 518 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 89% | 1261 MB |

The Mac running k6 peaked at 20% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 20% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.73 cores, 2239 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 390,665 vs 390,666 (-0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 267,804 vs 264,745 (+1.16%) | within 2% | ok |
| Writes stored (data check) | 69,847 posts stored for 69,822 acknowledged, 202,929 likes for 202,877 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 13 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 11 ms | 13 ms | 0.00% | 15% | pass |
| coarse 3 | 22 | 31 | 11 ms | 13 ms | 0.00% | 21% | pass |
| coarse 4 | 34 | 48 | 12 ms | 15 ms | 0.00% | 30% | pass |
| coarse 5 | 51 | 72 | 12 ms | 15 ms | 0.00% | 40% | pass |
| coarse 6 | 76 | 106 | 10 ms | 14 ms | 0.00% | 44% | pass |
| coarse 7 | 114 | 160 | 9 ms | 12 ms | 0.00% | 47% | pass |
| coarse 8 | 171 | 239 | 7 ms | 11 ms | 0.00% | 53% | pass |
| coarse 9 | 256 | 358 | 5 ms | 7 ms | 0.00% | 60% | pass |
| coarse 10 | 384 | 536 | 3 ms | 5 ms | 0.00% | 62% | pass |
| coarse 11 | 577 | 812 | 3 ms | 9 ms | 0.00% | 60% | pass |
| coarse 12 | 865 | 1207 | 75 ms | 92 ms | 0.00% | 87% | pass |
| coarse 13 | 1297 | 902 | 1255 ms | 16332 ms | 1.32% | 92% | fail: p95 1255 ms, p99 16332 ms, errors 1.3%, k6 dropped 47.1% of sessions |
| fine 1 | 952 | 914 | 1253 ms | 24856 ms | 2.34% | 96% | fail: p95 1253 ms, p99 24856 ms, errors 2.3%, k6 dropped 24.7% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 976 | 59999 ms | 60000 ms | 8.41% |
| back at 1x | 954 | 33005 ms | 60000 ms | 6.11% |

Did not recover within 2 minutes.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
