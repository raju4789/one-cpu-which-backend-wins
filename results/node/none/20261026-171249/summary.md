# node / none

Run `node-none-20261026-171249`, 2026-10-26T17:12:49+01:00 to 2026-10-26T17:48:21+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1817 req/s** | 1297 | 5197 | 1 ms | 17 ms | 52 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 32% | 188 MB |
| bench-cadvisor-1 | 0% | 35 MB |
| bench-nginx-1 | 6% | 53 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 41% | 594 MB |
| bench-postgres-exporter-1 | 0% | 12 MB |
| whole VM | 81% | 1312 MB |

The Mac running k6 peaked at 18% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 18% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.93 cores, 3336 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 585,465 vs 585,466 (-0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 560,407 vs 560,407 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 110,220 posts stored for 110,181 acknowledged, 308,827 likes for 308,746 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 9 ms | 12 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 8 ms | 13 ms | 0.00% | 11% | pass |
| coarse 3 | 22 | 31 | 9 ms | 14 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 47 | 9 ms | 17 ms | 0.00% | 20% | pass |
| coarse 5 | 51 | 72 | 9 ms | 16 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 105 | 9 ms | 15 ms | 0.00% | 35% | pass |
| coarse 7 | 114 | 159 | 10 ms | 18 ms | 0.00% | 45% | pass |
| coarse 8 | 171 | 239 | 8 ms | 15 ms | 0.00% | 44% | pass |
| coarse 9 | 256 | 358 | 7 ms | 14 ms | 0.00% | 48% | pass |
| coarse 10 | 384 | 539 | 5 ms | 15 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 806 | 4 ms | 15 ms | 0.00% | 57% | pass |
| coarse 12 | 865 | 1209 | 3 ms | 13 ms | 0.00% | 59% | pass |
| coarse 13 | 1297 | 1816 | 17 ms | 52 ms | 0.00% | 75% | pass |
| coarse 14 | 1946 | 2519 | 230 ms | 255 ms | 39.63% | 99% | fail: errors 39.6% |
| fine 1 | 1427 | 1981 | 186 ms | 210 ms | 4.04% | 94% | fail: errors 4.0% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2513 | 235 ms | 258 ms | 40.56% |
| back at 1x | 1814 | 17 ms | 48 ms | 0.00% |

Recovered.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
