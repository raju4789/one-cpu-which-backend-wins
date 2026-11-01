# rails / none (quick run, for tuning only)

Run `rails-none-20261028-062914`, 2026-10-28T06:29:14+01:00 to 2026-10-28T06:45:14+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1230 req/s** | 879 | 3581 | 3 ms | 240 ms | 318 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 51% | 127 MB |
| bench-cadvisor-1 | 0% | 37 MB |
| bench-nginx-1 | 5% | 54 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 29% | 526 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 93% | 1185 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.87 cores, 2732 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.48 s (-0.2% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 286,659 vs 284,227 (+0.86%) | within 2% | ok |
| Writes stored (data check) | 48,458 posts stored for 48,443 acknowledged, 139,199 likes for 139,174 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9c6728c7be, stack 28951a3027 (rails-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 903 | 3 ms | 9 ms | 0.00% | 60% | pass |
| coarse 2 | 698 | 979 | 3 ms | 15 ms | 0.00% | 67% | pass |
| coarse 3 | 753 | 1055 | 4 ms | 15 ms | 0.00% | 75% | pass |
| coarse 4 | 814 | 1140 | 15 ms | 66 ms | 0.00% | 78% | pass |
| coarse 5 | 879 | 1230 | 240 ms | 318 ms | 0.00% | 93% | pass |
| coarse 6 | 949 | 1004 | 1188 ms | 23073 ms | 1.11% | 100% | fail: p95 1188 ms, p99 23073 ms, errors 1.1%, k6 dropped 19.1% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1055 | 59996 ms | 60000 ms | 8.07% |
| back at 1x | 1034 | 32675 ms | 60000 ms | 5.63% |

Did not recover within 2 minutes.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.48 s.
