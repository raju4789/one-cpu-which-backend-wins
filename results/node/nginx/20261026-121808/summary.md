# node / nginx

Run `node-nginx-20261026-121808`, 2026-10-26T12:18:08+01:00 to 2026-10-26T12:57:48+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4907 req/s** | 3503 | 14025 | 0 ms | 17 ms | 62 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 44% | 162 MB |
| bench-cadvisor-1 | 0% | 24 MB |
| bench-nginx-1 | 18% | 73 MB |
| bench-nginx-exporter-1 | 0% | 8 MB |
| bench-postgres-1 | 22% | 659 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 87% | 1297 MB |

The Mac running k6 peaked at 24% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 24% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 2.04 cores, 7342 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,581,554 vs 1,581,554 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 1,496,164 vs 1,496,164 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 325,499 posts stored for 325,434 acknowledged, 954,425 likes for 954,998 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 13 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 8 ms | 12 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 8 ms | 15 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 7 ms | 10 ms | 0.00% | 11% | pass |
| coarse 5 | 51 | 71 | 7 ms | 10 ms | 0.00% | 16% | pass |
| coarse 6 | 76 | 106 | 8 ms | 12 ms | 0.00% | 20% | pass |
| coarse 7 | 114 | 159 | 8 ms | 13 ms | 0.00% | 28% | pass |
| coarse 8 | 171 | 238 | 8 ms | 15 ms | 0.00% | 37% | pass |
| coarse 9 | 256 | 359 | 8 ms | 14 ms | 0.00% | 41% | pass |
| coarse 10 | 384 | 537 | 7 ms | 12 ms | 0.00% | 40% | pass |
| coarse 11 | 577 | 805 | 6 ms | 11 ms | 0.00% | 43% | pass |
| coarse 12 | 865 | 1210 | 4 ms | 9 ms | 0.00% | 43% | pass |
| coarse 13 | 1297 | 1814 | 3 ms | 7 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2725 | 2 ms | 5 ms | 0.00% | 50% | pass |
| coarse 15 | 2919 | 4088 | 4 ms | 19 ms | 0.00% | 74% | pass |
| coarse 16 | 4379 | 5961 | 296 ms | 359 ms | 18.32% | 100% | fail: errors 18.3% |
| fine 1 | 3211 | 4498 | 7 ms | 34 ms | 0.00% | 77% | pass |
| fine 2 | 3503 | 4905 | 17 ms | 71 ms | 0.00% | 87% | pass |
| fine 3 | 3795 | 5246 | 244 ms | 296 ms | 7.70% | 100% | fail: errors 7.7% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 6640 | 349 ms | 438 ms | 24.57% |
| back at 1x | 4896 | 14 ms | 71 ms | 0.00% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
