# node / none

Run `node-none-20261026-094627`, 2026-10-26T09:46:27+01:00 to 2026-10-26T10:23:53+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1694 req/s** | 1211 | 4847 | 1 ms | 16 ms | 49 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 29% | 188 MB |
| bench-cadvisor-1 | 0% | 22 MB |
| bench-nginx-1 | 6% | 49 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 43% | 552 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 77% | 1174 MB |

The Mac running k6 peaked at 15% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 15% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.86 cores, 3135 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.55 s (+1.1% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 546,295 vs 546,295 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 458,154 vs 458,155 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 121,986 posts stored for 121,578 acknowledged, 290,173 likes for 290,181 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 43614a0612 (node-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 9 ms | 13 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 31 | 9 ms | 14 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 48 | 9 ms | 13 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 71 | 10 ms | 15 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 106 | 10 ms | 17 ms | 0.00% | 40% | pass |
| coarse 7 | 114 | 160 | 10 ms | 18 ms | 0.00% | 46% | pass |
| coarse 8 | 171 | 240 | 8 ms | 15 ms | 0.00% | 47% | pass |
| coarse 9 | 256 | 359 | 7 ms | 14 ms | 0.00% | 51% | pass |
| coarse 10 | 384 | 539 | 5 ms | 13 ms | 0.00% | 50% | pass |
| coarse 11 | 577 | 809 | 4 ms | 14 ms | 0.00% | 57% | pass |
| coarse 12 | 865 | 1210 | 4 ms | 16 ms | 0.00% | 61% | pass |
| coarse 13 | 1297 | 1813 | 1882 ms | 2131 ms | 1.70% | 91% | fail: p95 1882 ms, p99 2131 ms, errors 1.7% |
| fine 1 | 952 | 1333 | 5 ms | 16 ms | 0.00% | 63% | pass |
| fine 2 | 1038 | 1449 | 7 ms | 20 ms | 0.00% | 65% | pass |
| fine 3 | 1124 | 1570 | 11 ms | 29 ms | 0.00% | 73% | pass |
| fine 4 | 1211 | 1697 | 17 ms | 46 ms | 0.00% | 77% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1757 | 3228 ms | 3308 ms | 21.39% |
| back at 1x | 1698 | 2499 ms | 2684 ms | 11.84% |

Did not recover within 2 minutes.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 5.55 s.
