# node / app

Run `node-app-20261026-112829`, 2026-10-26T11:28:29+01:00 to 2026-10-26T12:08:07+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4906 req/s** | 3503 | 14286 | 3 ms | 238 ms | 456 ms | 0.89% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 50% | 260 MB |
| bench-cadvisor-1 | 0% | 36 MB |
| bench-nginx-1 | 18% | 89 MB |
| bench-nginx-exporter-1 | 0% | 16 MB |
| bench-postgres-1 | 21% | 656 MB |
| bench-postgres-exporter-1 | 0% | 17 MB |
| whole VM | 94% | 1398 MB |

The Mac running k6 peaked at 23% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 23% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.75 cores, 7355 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,581,161 vs 1,581,162 (-0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 1,222,507 vs 1,222,507 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 310,408 posts stored for 310,192 acknowledged, 932,108 likes for 931,802 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 7 ms | 11 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 7 ms | 9 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 7 ms | 10 ms | 0.00% | 10% | pass |
| coarse 4 | 34 | 48 | 7 ms | 11 ms | 0.00% | 12% | pass |
| coarse 5 | 51 | 72 | 7 ms | 12 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 105 | 7 ms | 11 ms | 0.00% | 22% | pass |
| coarse 7 | 114 | 160 | 8 ms | 13 ms | 0.00% | 29% | pass |
| coarse 8 | 171 | 238 | 9 ms | 15 ms | 0.00% | 38% | pass |
| coarse 9 | 256 | 358 | 8 ms | 14 ms | 0.00% | 42% | pass |
| coarse 10 | 384 | 538 | 7 ms | 12 ms | 0.00% | 43% | pass |
| coarse 11 | 577 | 808 | 6 ms | 11 ms | 0.00% | 43% | pass |
| coarse 12 | 865 | 1211 | 5 ms | 10 ms | 0.00% | 47% | pass |
| coarse 13 | 1297 | 1815 | 4 ms | 8 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2725 | 3 ms | 9 ms | 0.00% | 54% | pass |
| coarse 15 | 2919 | 4087 | 7 ms | 29 ms | 0.00% | 68% | pass |
| coarse 16 | 4379 | 4411 | 10163 ms | 19243 ms | 8.33% | 93% | fail: p95 10163 ms, p99 19243 ms, errors 8.3%, k6 dropped 26.8% of sessions |
| fine 1 | 3211 | 4491 | 11 ms | 45 ms | 0.00% | 86% | pass |
| fine 2 | 3503 | 4905 | 102 ms | 188 ms | 0.02% | 95% | pass |
| fine 3 | 3795 | 5299 | 787 ms | 2195 ms | 5.52% | 92% | fail: p95 787 ms, p99 2195 ms, errors 5.5% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 4196 | 10572 ms | 28884 ms | 7.91% |
| back at 1x | 4904 | 807 ms | 3139 ms | 3.65% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
