# rails / nginx (quick run, for tuning only)

Run `rails-nginx-20261028-135453`, 2026-10-28T13:54:53+01:00 to 2026-10-28T14:11:54+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2666 req/s** | 1904 | 7614 | 0 ms | 2 ms | 4 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 29% | 125 MB |
| bench-cadvisor-1 | 0% | 41 MB |
| bench-nginx-1 | 10% | 61 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 13% | 559 MB |
| bench-postgres-exporter-1 | 0% | 18 MB |
| whole VM | 58% | 1339 MB |

The Mac running k6 peaked at 15% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 15% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.52 cores, 4902 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 770,790 vs 770,790 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 121,069 posts stored for 121,069 acknowledged, 359,379 likes for 359,557 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 1200 | 1678 | 3 ms | 5 ms | 0.00% | 46% | pass |
| coarse 2 | 1296 | 1812 | 3 ms | 4 ms | 0.00% | 45% | pass |
| coarse 3 | 1400 | 1962 | 2 ms | 4 ms | 0.00% | 49% | pass |
| coarse 4 | 1512 | 2111 | 2 ms | 4 ms | 0.00% | 48% | pass |
| coarse 5 | 1633 | 2286 | 2 ms | 4 ms | 0.00% | 49% | pass |
| coarse 6 | 1763 | 2469 | 2 ms | 4 ms | 0.00% | 51% | pass |
| coarse 7 | 1904 | 2666 | 2 ms | 4 ms | 0.00% | 58% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 3304 | 11962 ms | 60000 ms | 3.21% |
| back at 1x | 2666 | 936 ms | 1125 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
