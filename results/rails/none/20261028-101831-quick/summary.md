# rails / none (quick run, for tuning only)

Run `rails-none-20261028-101831`, 2026-10-28T10:18:31+01:00 to 2026-10-28T10:34:38+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1232 req/s** | 879 | 3521 | 2 ms | 62 ms | 92 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 52% | 132 MB |
| bench-cadvisor-1 | 0% | 19 MB |
| bench-nginx-1 | 5% | 47 MB |
| bench-nginx-exporter-1 | 0% | 12 MB |
| bench-postgres-1 | 29% | 504 MB |
| bench-postgres-exporter-1 | 0% | 19 MB |
| whole VM | 93% | 1240 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.78 cores, 2639 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 284,731 vs 282,235 (+0.88%) | within 2% | ok |
| Writes stored (data check) | 48,108 posts stored for 48,099 acknowledged, 140,457 likes for 140,438 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 05fd44ef7f, stack 05fd44ef7f | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 903 | 3 ms | 7 ms | 0.00% | 65% | pass |
| coarse 2 | 698 | 978 | 4 ms | 23 ms | 0.00% | 73% | pass |
| coarse 3 | 753 | 1053 | 4 ms | 11 ms | 0.00% | 72% | pass |
| coarse 4 | 814 | 1138 | 12 ms | 89 ms | 0.00% | 85% | pass |
| coarse 5 | 879 | 1232 | 62 ms | 92 ms | 0.00% | 93% | pass |
| coarse 6 | 949 | 1113 | 1090 ms | 17025 ms | 1.01% | 99% | fail: p95 1090 ms, p99 17025 ms, errors 1.0%, k6 dropped 10.6% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1041 | 60000 ms | 60000 ms | 7.76% |
| back at 1x | 1035 | 36838 ms | 60000 ms | 5.99% |

Did not recover within 2 minutes.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
