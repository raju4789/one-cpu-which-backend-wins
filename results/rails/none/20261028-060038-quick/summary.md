# rails / none (quick run, for tuning only)

Run `rails-none-20261028-060038`, 2026-10-28T06:00:38+01:00 to 2026-10-28T06:15:44+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1141 req/s** | 814 | 3263 | 1 ms | 46 ms | 121 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 48% | 113 MB |
| bench-cadvisor-1 | 0% | 33 MB |
| bench-nginx-1 | 5% | 48 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 28% | 463 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 82% | 1151 MB |

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
| Nginx vs k6 request count (overload) | 304,707 vs 303,692 (+0.33%) | within 2% | ok |
| Writes stored (data check) | 45,320 posts stored for 45,310 acknowledged, 132,690 likes for 132,652 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9c6728c7be, stack 9c6728c7be | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 902 | 3 ms | 13 ms | 0.00% | 68% | pass |
| coarse 2 | 698 | 978 | 4 ms | 25 ms | 0.00% | 73% | pass |
| coarse 3 | 753 | 1055 | 5 ms | 17 ms | 0.00% | 78% | pass |
| coarse 4 | 814 | 1141 | 46 ms | 121 ms | 0.00% | 82% | pass |
| coarse 5 | 879 | 1169 | 975 ms | 1006 ms | 0.00% | 97% | fail: p95 975 ms, p99 1006 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1162 | 56769 ms | 60000 ms | 6.63% |
| back at 1x | 1124 | 1017 ms | 60000 ms | 2.11% |

Did not recover within 2 minutes.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
