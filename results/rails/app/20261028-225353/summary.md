# rails / app

Run `rails-app-20261028-225353`, 2026-10-28T22:53:53+01:00 to 2026-10-28T23:32:22+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2544 req/s** | 1816 | 7271 | 1 ms | 12 ms | 56 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 58% | 137 MB |
| bench-cadvisor-1 | 0% | 25 MB |
| bench-nginx-1 | 10% | 58 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 12% | 579 MB |
| bench-postgres-exporter-1 | 0% | 14 MB |
| whole VM | 79% | 1257 MB |

The Mac running k6 peaked at 20% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 20% | < 70% | ok |
| Mac memory compressed during the run | 0.3 GB | < 2 GB | ok |
| k6 process, peak | 1.21 cores, 4591 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 820,283 vs 820,284 (-0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 543,211 vs 532,890 (+1.94%) | within 2% | ok |
| Writes stored (data check) | 163,109 posts stored for 162,930 acknowledged, 480,958 likes for 480,510 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 10 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 20 | 8 ms | 9 ms | 0.00% | 9% | pass |
| coarse 3 | 22 | 31 | 8 ms | 11 ms | 0.00% | 12% | pass |
| coarse 4 | 34 | 49 | 8 ms | 11 ms | 0.00% | 16% | pass |
| coarse 5 | 51 | 71 | 8 ms | 12 ms | 0.00% | 21% | pass |
| coarse 6 | 76 | 106 | 9 ms | 12 ms | 0.00% | 28% | pass |
| coarse 7 | 114 | 159 | 10 ms | 14 ms | 0.00% | 42% | pass |
| coarse 8 | 171 | 239 | 8 ms | 13 ms | 0.00% | 45% | pass |
| coarse 9 | 256 | 361 | 7 ms | 10 ms | 0.00% | 48% | pass |
| coarse 10 | 384 | 538 | 6 ms | 10 ms | 0.00% | 49% | pass |
| coarse 11 | 577 | 805 | 4 ms | 7 ms | 0.00% | 54% | pass |
| coarse 12 | 865 | 1214 | 3 ms | 5 ms | 0.00% | 51% | pass |
| coarse 13 | 1297 | 1809 | 2 ms | 5 ms | 0.00% | 56% | pass |
| coarse 14 | 1946 | 1833 | 11616 ms | 31976 ms | 1.18% | 92% | fail: p95 11616 ms, p99 31976 ms, errors 1.2%, k6 dropped 22.1% of sessions |
| fine 1 | 1427 | 1996 | 3 ms | 9 ms | 0.00% | 61% | pass |
| fine 2 | 1556 | 2179 | 3 ms | 11 ms | 0.00% | 68% | pass |
| fine 3 | 1686 | 2365 | 6 ms | 49 ms | 0.00% | 74% | pass |
| fine 4 | 1816 | 2540 | 8 ms | 48 ms | 0.00% | 81% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1913 | 60000 ms | 60000 ms | 9.48% |
| back at 1x | 1918 | 45975 ms | 60000 ms | 5.72% |

Did not recover within 2 minutes.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
