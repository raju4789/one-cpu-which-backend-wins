# node / none

Run `node-none-20261026-103354`, 2026-10-26T10:33:54+01:00 to 2026-10-26T11:18:29+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1815 req/s** | 1297 | 5195 | 1 ms | 23 ms | 69 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 166 MB |
| bench-cadvisor-1 | 0% | 33 MB |
| bench-nginx-1 | 6% | 54 MB |
| bench-nginx-exporter-1 | 0% | 9 MB |
| bench-postgres-1 | 41% | 606 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 80% | 1227 MB |

The Mac running k6 peaked at 19% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 19% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.85 cores, 3328 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.49 s (+0.0% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 585,324 vs 585,324 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 560,273 vs 560,274 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 161,966 posts stored for 161,925 acknowledged, 460,307 likes for 460,241 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 13 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 11% | pass |
| coarse 3 | 22 | 30 | 8 ms | 13 ms | 0.00% | 15% | pass |
| coarse 4 | 34 | 47 | 9 ms | 12 ms | 0.00% | 21% | pass |
| coarse 5 | 51 | 72 | 9 ms | 16 ms | 0.00% | 31% | pass |
| coarse 6 | 76 | 107 | 9 ms | 17 ms | 0.00% | 39% | pass |
| coarse 7 | 114 | 161 | 9 ms | 17 ms | 0.00% | 43% | pass |
| coarse 8 | 171 | 239 | 8 ms | 15 ms | 0.00% | 47% | pass |
| coarse 9 | 256 | 357 | 7 ms | 14 ms | 0.00% | 46% | pass |
| coarse 10 | 384 | 538 | 5 ms | 14 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 810 | 4 ms | 14 ms | 0.00% | 53% | pass |
| coarse 12 | 865 | 1213 | 3 ms | 14 ms | 0.00% | 53% | pass |
| coarse 13 | 1297 | 1814 | 15 ms | 32 ms | 0.00% | 81% | pass |
| coarse 14 | 1946 | 2514 | 230 ms | 250 ms | 39.22% | 96% | fail: errors 39.2% |
| fine 1 | 1427 | 1997 | 135 ms | 159 ms | 0.13% | 94% | pass |
| fine 2 | 1556 | 2120 | 196 ms | 213 ms | 12.78% | 93% | fail: errors 12.8% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2510 | 235 ms | 261 ms | 40.63% |
| back at 1x | 1815 | 23 ms | 151 ms | 0.00% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.49 s.
