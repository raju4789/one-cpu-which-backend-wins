# node / app

Run `node-app-20261026-175821`, 2026-10-26T17:58:21+01:00 to 2026-10-26T18:36:58+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4495 req/s** | 3211 | 12873 | 1 ms | 23 ms | 138 ms | 0.05% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 47% | 192 MB |
| bench-cadvisor-1 | 0% | 37 MB |
| bench-nginx-1 | 16% | 78 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 20% | 639 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 88% | 1291 MB |

The Mac running k6 peaked at 28% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 28% | < 70% | ok |
| Mac memory compressed during the run | 0.2 GB | < 2 GB | ok |
| k6 process, peak | 2.04 cores, 7273 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,448,896 vs 1,448,896 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 1,115,535 vs 1,115,536 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 285,885 posts stored for 285,684 acknowledged, 859,434 likes for 859,091 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 12 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 7 ms | 12 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 7 ms | 11 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 7 ms | 11 ms | 0.00% | 12% | pass |
| coarse 5 | 51 | 71 | 7 ms | 12 ms | 0.00% | 16% | pass |
| coarse 6 | 76 | 107 | 7 ms | 11 ms | 0.00% | 23% | pass |
| coarse 7 | 114 | 160 | 8 ms | 14 ms | 0.00% | 30% | pass |
| coarse 8 | 171 | 240 | 9 ms | 14 ms | 0.00% | 39% | pass |
| coarse 9 | 256 | 359 | 8 ms | 13 ms | 0.00% | 44% | pass |
| coarse 10 | 384 | 537 | 7 ms | 12 ms | 0.00% | 44% | pass |
| coarse 11 | 577 | 810 | 6 ms | 11 ms | 0.00% | 43% | pass |
| coarse 12 | 865 | 1212 | 5 ms | 11 ms | 0.00% | 48% | pass |
| coarse 13 | 1297 | 1814 | 3 ms | 7 ms | 0.00% | 44% | pass |
| coarse 14 | 1946 | 2717 | 3 ms | 8 ms | 0.00% | 52% | pass |
| coarse 15 | 2919 | 4081 | 6 ms | 28 ms | 0.00% | 76% | pass |
| coarse 16 | 4379 | 5337 | 2157 ms | 8936 ms | 6.58% | 91% | fail: p95 2157 ms, p99 8936 ms, errors 6.6%, k6 dropped 11.7% of sessions |
| fine 1 | 3211 | 4494 | 68 ms | 235 ms | 0.10% | 89% | pass |
| fine 2 | 3503 | 4905 | 294 ms | 566 ms | 2.26% | 93% | fail: errors 2.3% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 3761 | 11074 ms | 29959 ms | 8.27% |
| back at 1x | 4495 | 209 ms | 713 ms | 0.56% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
