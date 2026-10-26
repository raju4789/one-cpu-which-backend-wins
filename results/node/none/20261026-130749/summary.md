# node / none

Run `node-none-20261026-130749`, 2026-10-26T13:07:49+01:00 to 2026-10-26T13:43:21+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1814 req/s** | 1297 | 5213 | 2 ms | 83 ms | 203 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 31% | 196 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 6% | 57 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 47% | 503 MB |
| bench-postgres-exporter-1 | 0% | 12 MB |
| whole VM | 87% | 1145 MB |

The Mac running k6 peaked at 20% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 20% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.91 cores, 3307 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 585,212 vs 585,213 (-0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 469,355 vs 469,354 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 116,377 posts stored for 115,600 acknowledged, 212,653 likes for 212,663 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 43614a0612 (node-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 9 ms | 13 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 30 | 9 ms | 15 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 48 | 10 ms | 14 ms | 0.00% | 21% | pass |
| coarse 5 | 51 | 72 | 10 ms | 15 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 105 | 10 ms | 18 ms | 0.00% | 41% | pass |
| coarse 7 | 114 | 159 | 10 ms | 16 ms | 0.00% | 44% | pass |
| coarse 8 | 171 | 238 | 8 ms | 15 ms | 0.00% | 46% | pass |
| coarse 9 | 256 | 358 | 7 ms | 14 ms | 0.00% | 48% | pass |
| coarse 10 | 384 | 537 | 5 ms | 15 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 807 | 4 ms | 16 ms | 0.00% | 50% | pass |
| coarse 12 | 865 | 1209 | 3 ms | 13 ms | 0.00% | 56% | pass |
| coarse 13 | 1297 | 1816 | 63 ms | 98 ms | 0.00% | 81% | pass |
| coarse 14 | 1946 | 1770 | 3222 ms | 3335 ms | 21.45% | 100% | fail: p95 3222 ms, p99 3335 ms, errors 21.4%, k6 dropped 35.1% of sessions |
| fine 1 | 1427 | 1846 | 3243 ms | 3339 ms | 20.83% | 96% | fail: p95 3243 ms, p99 3339 ms, errors 20.8%, k6 dropped 7.5% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1767 | 3196 ms | 3259 ms | 21.36% |
| back at 1x | 1757 | 3205 ms | 3255 ms | 20.55% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
