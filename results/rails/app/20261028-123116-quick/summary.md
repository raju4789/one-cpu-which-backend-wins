# rails / app (quick run, for tuning only)

Run `rails-app-20261028-123116`, 2026-10-28T12:31:16+01:00 to 2026-10-28T12:48:21+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2666 req/s** | 1904 | 7624 | 2 ms | 36 ms | 71 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 65% | 111 MB |
| bench-cadvisor-1 | 0% | 29 MB |
| bench-nginx-1 | 11% | 63 MB |
| bench-nginx-exporter-1 | 0% | 13 MB |
| bench-postgres-1 | 12% | 516 MB |
| bench-postgres-exporter-1 | 0% | 12 MB |
| whole VM | 92% | 1160 MB |

The Mac running k6 peaked at 18% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 18% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.57 cores, 4924 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.61 s (+2.2% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 472,826 vs 466,082 (+1.45%) | within 2% | ok |
| Writes stored (data check) | 97,848 posts stored for 97,834 acknowledged, 282,011 likes for 282,008 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 1200 | 1681 | 2 ms | 6 ms | 0.00% | 58% | pass |
| coarse 2 | 1296 | 1811 | 2 ms | 7 ms | 0.00% | 57% | pass |
| coarse 3 | 1400 | 1960 | 2 ms | 5 ms | 0.00% | 62% | pass |
| coarse 4 | 1512 | 2118 | 3 ms | 17 ms | 0.00% | 61% | pass |
| coarse 5 | 1633 | 2290 | 4 ms | 22 ms | 0.00% | 66% | pass |
| coarse 6 | 1763 | 2467 | 11 ms | 50 ms | 0.00% | 80% | pass |
| coarse 7 | 1904 | 2666 | 36 ms | 71 ms | 0.00% | 92% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1537 | 60000 ms | 60001 ms | 11.43% |
| back at 1x | 1713 | 59987 ms | 60000 ms | 6.92% |

Did not recover within 2 minutes.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.61 s.
