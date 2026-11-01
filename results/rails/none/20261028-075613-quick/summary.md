# rails / none (quick run, for tuning only)

Run `rails-none-20261028-075613`, 2026-10-28T07:56:13+01:00 to 2026-10-28T08:11:20+01:00

**Warning:** overload recovery tested at 70% of the rate (570 sessions/s), not at the rate itself: a diagnostic, not comparable with normal overload results

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1138 req/s** | 814 | 3265 | 1 ms | 24 ms | 114 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 52% | 121 MB |
| bench-cadvisor-1 | 0% | 39 MB |
| bench-nginx-1 | 5% | 50 MB |
| bench-nginx-exporter-1 | 0% | 16 MB |
| bench-postgres-1 | 26% | 452 MB |
| bench-postgres-exporter-1 | 0% | 15 MB |
| whole VM | 87% | 1176 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.78 cores, 2637 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.62 s (+2.4% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 244,107 vs 244,107 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 41,542 posts stored for 41,532 acknowledged, 122,222 likes for 122,199 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 53442c6bc3, stack 53442c6bc3 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 901 | 3 ms | 7 ms | 0.00% | 65% | pass |
| coarse 2 | 698 | 978 | 4 ms | 17 ms | 0.00% | 71% | pass |
| coarse 3 | 753 | 1056 | 5 ms | 16 ms | 0.00% | 80% | pass |
| coarse 4 | 814 | 1138 | 24 ms | 114 ms | 0.00% | 87% | pass |
| coarse 5 | 879 | 1211 | 818 ms | 1220 ms | 0.00% | 84% | fail: p95 818 ms, p99 1220 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 972 | 56571 ms | 60000 ms | 6.02% |
| back at 570 sessions/s | 798 | 1030 ms | 1083 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 8% of the core with no load (monitoring agents and Postgres).
Calibration: 5.62 s.
