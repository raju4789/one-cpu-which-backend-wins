# node / none

Run `node-none-20261026-162716`, 2026-10-26T16:27:16+01:00 to 2026-10-26T17:02:48+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1815 req/s** | 1297 | 5201 | 1 ms | 48 ms | 89 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 347 MB |
| bench-cadvisor-1 | 0% | 24 MB |
| bench-nginx-1 | 6% | 54 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 47% | 561 MB |
| bench-postgres-exporter-1 | 0% | 9 MB |
| whole VM | 83% | 1365 MB |

The Mac running k6 peaked at 19% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 19% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.92 cores, 3320 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.48 s (-0.2% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 585,456 vs 585,456 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 473,873 vs 473,874 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 116,632 posts stored for 115,750 acknowledged, 213,289 likes for 213,295 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 43614a0612 (node-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 14 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 9 ms | 14 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 30 | 9 ms | 15 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 48 | 9 ms | 15 ms | 0.00% | 23% | pass |
| coarse 5 | 51 | 72 | 10 ms | 17 ms | 0.00% | 31% | pass |
| coarse 6 | 76 | 106 | 10 ms | 18 ms | 0.00% | 39% | pass |
| coarse 7 | 114 | 160 | 10 ms | 17 ms | 0.00% | 47% | pass |
| coarse 8 | 171 | 239 | 8 ms | 15 ms | 0.00% | 50% | pass |
| coarse 9 | 256 | 358 | 7 ms | 13 ms | 0.00% | 47% | pass |
| coarse 10 | 384 | 537 | 5 ms | 15 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 808 | 4 ms | 13 ms | 0.00% | 58% | pass |
| coarse 12 | 865 | 1213 | 4 ms | 14 ms | 0.00% | 54% | pass |
| coarse 13 | 1297 | 1815 | 174 ms | 237 ms | 0.00% | 86% | pass |
| coarse 14 | 1946 | 1773 | 3229 ms | 3336 ms | 21.33% | 91% | fail: p95 3229 ms, p99 3336 ms, errors 21.3%, k6 dropped 35.0% of sessions |
| fine 1 | 1427 | 1847 | 3143 ms | 3318 ms | 21.12% | 89% | fail: p95 3143 ms, p99 3318 ms, errors 21.1%, k6 dropped 7.6% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1781 | 3121 ms | 3167 ms | 21.52% |
| back at 1x | 1783 | 3097 ms | 3141 ms | 20.64% |

Did not recover within 2 minutes.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 5.48 s.
