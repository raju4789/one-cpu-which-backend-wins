# node / nginx

Run `node-nginx-20261026-153734`, 2026-10-26T15:37:34+01:00 to 2026-10-26T16:17:15+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4905 req/s** | 3503 | 14022 | 0 ms | 19 ms | 107 ms | 0.09% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 44% | 162 MB |
| bench-cadvisor-1 | 0% | 38 MB |
| bench-nginx-1 | 17% | 78 MB |
| bench-nginx-exporter-1 | 0% | 12 MB |
| bench-postgres-1 | 23% | 658 MB |
| bench-postgres-exporter-1 | 0% | 18 MB |
| whole VM | 86% | 1327 MB |

The Mac running k6 peaked at 23% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 23% | < 70% | ok |
| Mac memory compressed during the run | 0.2 GB | < 2 GB | ok |
| k6 process, peak | 1.9 cores, 7342 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,581,095 vs 1,581,095 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 1,494,985 vs 1,494,985 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 324,327 posts stored for 324,185 acknowledged, 947,383 likes for 947,656 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 5% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 7 ms | 11 ms | 0.00% | 12% | pass |
| coarse 5 | 51 | 71 | 7 ms | 11 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 107 | 8 ms | 12 ms | 0.00% | 20% | pass |
| coarse 7 | 114 | 160 | 8 ms | 12 ms | 0.00% | 28% | pass |
| coarse 8 | 171 | 238 | 8 ms | 15 ms | 0.00% | 37% | pass |
| coarse 9 | 256 | 358 | 7 ms | 13 ms | 0.00% | 38% | pass |
| coarse 10 | 384 | 537 | 7 ms | 12 ms | 0.00% | 42% | pass |
| coarse 11 | 577 | 808 | 6 ms | 11 ms | 0.00% | 40% | pass |
| coarse 12 | 865 | 1210 | 4 ms | 9 ms | 0.00% | 46% | pass |
| coarse 13 | 1297 | 1816 | 3 ms | 7 ms | 0.00% | 45% | pass |
| coarse 14 | 1946 | 2721 | 2 ms | 6 ms | 0.00% | 48% | pass |
| coarse 15 | 2919 | 4091 | 4 ms | 20 ms | 0.00% | 73% | pass |
| coarse 16 | 4379 | 5962 | 291 ms | 355 ms | 18.61% | 100% | fail: errors 18.6% |
| fine 1 | 3211 | 4503 | 7 ms | 22 ms | 0.00% | 76% | pass |
| fine 2 | 3503 | 4904 | 14 ms | 34 ms | 0.00% | 85% | pass |
| fine 3 | 3795 | 5233 | 256 ms | 316 ms | 9.24% | 90% | fail: errors 9.2% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 6623 | 355 ms | 442 ms | 25.42% |
| back at 1x | 4903 | 19 ms | 84 ms | 0.01% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
