# rails / none (quick run, for tuning only)

Run `rails-none-20261028-092527`, 2026-10-28T09:25:27+01:00 to 2026-10-28T09:40:34+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1137 req/s** | 814 | 3263 | 1 ms | 41 ms | 129 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 50% | 106 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 5% | 46 MB |
| bench-nginx-exporter-1 | 0% | 8 MB |
| bench-postgres-1 | 28% | 454 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 84% | 1148 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.82 cores, 2635 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 285,668 vs 283,814 (+0.65%) | within 2% | ok |
| Writes stored (data check) | 44,249 posts stored for 44,248 acknowledged, 128,816 likes for 128,815 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness d881712259, stack d881712259 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 906 | 3 ms | 9 ms | 0.00% | 66% | pass |
| coarse 2 | 698 | 974 | 4 ms | 41 ms | 0.00% | 64% | pass |
| coarse 3 | 753 | 1053 | 4 ms | 15 ms | 0.00% | 77% | pass |
| coarse 4 | 814 | 1137 | 41 ms | 129 ms | 0.00% | 84% | pass |
| coarse 5 | 879 | 1227 | 358 ms | 393 ms | 0.00% | 90% | fail: p95 358 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1060 | 59999 ms | 60000 ms | 7.51% |
| back at 1x | 1053 | 20864 ms | 60000 ms | 5.05% |

Did not recover within 2 minutes.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
