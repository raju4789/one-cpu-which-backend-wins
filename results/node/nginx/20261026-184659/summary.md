# node / nginx

Run `node-nginx-20261026-184659`, 2026-10-26T18:46:59+01:00 to 2026-10-26T19:26:40+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4898 req/s** | 3503 | 14042 | 0 ms | 28 ms | 190 ms | 0.51% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 46% | 172 MB |
| bench-cadvisor-1 | 0% | 27 MB |
| bench-nginx-1 | 18% | 80 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 23% | 656 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 88% | 1333 MB |

The Mac running k6 peaked at 29% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 29% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.93 cores, 7353 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,579,395 vs 1,579,395 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 1,497,337 vs 1,497,338 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 324,650 posts stored for 324,523 acknowledged, 948,868 likes for 949,288 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 12 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 20 | 7 ms | 12 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 30 | 8 ms | 12 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 7 ms | 10 ms | 0.00% | 11% | pass |
| coarse 5 | 51 | 71 | 7 ms | 11 ms | 0.00% | 14% | pass |
| coarse 6 | 76 | 107 | 7 ms | 11 ms | 0.00% | 21% | pass |
| coarse 7 | 114 | 160 | 8 ms | 13 ms | 0.00% | 29% | pass |
| coarse 8 | 171 | 239 | 8 ms | 15 ms | 0.00% | 35% | pass |
| coarse 9 | 256 | 356 | 7 ms | 13 ms | 0.00% | 37% | pass |
| coarse 10 | 384 | 538 | 7 ms | 12 ms | 0.00% | 41% | pass |
| coarse 11 | 577 | 809 | 6 ms | 11 ms | 0.00% | 43% | pass |
| coarse 12 | 865 | 1212 | 4 ms | 10 ms | 0.00% | 44% | pass |
| coarse 13 | 1297 | 1815 | 3 ms | 8 ms | 0.00% | 43% | pass |
| coarse 14 | 1946 | 2728 | 2 ms | 7 ms | 0.00% | 48% | pass |
| coarse 15 | 2919 | 4082 | 5 ms | 37 ms | 0.07% | 74% | pass |
| coarse 16 | 4379 | 5965 | 290 ms | 350 ms | 18.30% | 100% | fail: errors 18.3% |
| fine 1 | 3211 | 4496 | 7 ms | 32 ms | 0.00% | 72% | pass |
| fine 2 | 3503 | 4908 | 14 ms | 35 ms | 0.00% | 84% | pass |
| fine 3 | 3795 | 5243 | 244 ms | 302 ms | 8.57% | 86% | fail: errors 8.6% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 6644 | 350 ms | 438 ms | 24.48% |
| back at 1x | 4907 | 16 ms | 52 ms | 0.00% |

Recovered.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
