# spring / none

Run `spring-none-20261103-083648`, 2026-11-03T08:36:48+01:00 to 2026-11-03T09:15:18+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2364 req/s** | 1686 | 6752 | 1 ms | 29 ms | 60 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 19% | 508 MB |
| bench-cadvisor-1 | 0% | 28 MB |
| bench-nginx-1 | 8% | 53 MB |
| bench-nginx-exporter-1 | 0% | 9 MB |
| bench-postgres-1 | 55% | 546 MB |
| bench-postgres-exporter-1 | 0% | 9 MB |
| whole VM | 82% | 1561 MB |

The Mac running k6 peaked at 18% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 18% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.99 cores, 3707 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 761,908 vs 761,908 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 696,835 vs 696,834 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 154,162 posts stored for 154,138 acknowledged, 439,469 likes for 439,450 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 17b0155dd5, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 11 ms | 15 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 20 | 10 ms | 14 ms | 0.00% | 16% | pass |
| coarse 3 | 22 | 30 | 9 ms | 13 ms | 0.00% | 18% | pass |
| coarse 4 | 34 | 48 | 8 ms | 11 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 72 | 8 ms | 11 ms | 0.00% | 28% | pass |
| coarse 6 | 76 | 105 | 8 ms | 11 ms | 0.00% | 34% | pass |
| coarse 7 | 114 | 159 | 7 ms | 11 ms | 0.00% | 43% | pass |
| coarse 8 | 171 | 240 | 7 ms | 11 ms | 0.00% | 50% | pass |
| coarse 9 | 256 | 358 | 5 ms | 8 ms | 0.00% | 52% | pass |
| coarse 10 | 384 | 538 | 5 ms | 8 ms | 0.00% | 52% | pass |
| coarse 11 | 577 | 806 | 3 ms | 5 ms | 0.00% | 61% | pass |
| coarse 12 | 865 | 1212 | 2 ms | 4 ms | 0.00% | 55% | pass |
| coarse 13 | 1297 | 1817 | 2 ms | 6 ms | 0.00% | 66% | pass |
| coarse 14 | 1946 | 2523 | 563 ms | 962 ms | 37.52% | 100% | fail: p95 563 ms, errors 37.5% |
| fine 1 | 1427 | 1995 | 2 ms | 11 ms | 0.00% | 70% | pass |
| fine 2 | 1556 | 2180 | 3 ms | 36 ms | 0.00% | 71% | pass |
| fine 3 | 1686 | 2362 | 34 ms | 65 ms | 0.00% | 79% | pass |
| fine 4 | 1816 | 2462 | 208 ms | 244 ms | 17.09% | 98% | fail: errors 17.1% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 3000 | 304 ms | 357 ms | 55.72% |
| back at 1x | 2355 | 60 ms | 149 ms | 0.32% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
