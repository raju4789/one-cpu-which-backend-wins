# spring / none

Run `spring-none-20261103-062202`, 2026-11-03T06:22:02+01:00 to 2026-11-03T07:00:40+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2363 req/s** | 1686 | 6757 | 1 ms | 49 ms | 78 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 18% | 519 MB |
| bench-cadvisor-1 | 0% | 28 MB |
| bench-nginx-1 | 7% | 55 MB |
| bench-nginx-exporter-1 | 0% | 13 MB |
| bench-postgres-1 | 55% | 548 MB |
| bench-postgres-exporter-1 | 0% | 10 MB |
| whole VM | 85% | 1543 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.96 cores, 3702 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 761,795 vs 761,795 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 696,666 vs 696,666 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 154,922 posts stored for 154,895 acknowledged, 437,257 likes for 437,230 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 17b0155dd5, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 15 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 11 ms | 16 ms | 0.00% | 15% | pass |
| coarse 3 | 22 | 31 | 10 ms | 14 ms | 0.00% | 20% | pass |
| coarse 4 | 34 | 47 | 8 ms | 13 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 72 | 8 ms | 11 ms | 0.00% | 29% | pass |
| coarse 6 | 76 | 107 | 8 ms | 11 ms | 0.00% | 37% | pass |
| coarse 7 | 114 | 160 | 8 ms | 11 ms | 0.00% | 43% | pass |
| coarse 8 | 171 | 238 | 7 ms | 11 ms | 0.00% | 52% | pass |
| coarse 9 | 256 | 356 | 5 ms | 8 ms | 0.00% | 54% | pass |
| coarse 10 | 384 | 537 | 5 ms | 8 ms | 0.00% | 55% | pass |
| coarse 11 | 577 | 809 | 3 ms | 5 ms | 0.00% | 61% | pass |
| coarse 12 | 865 | 1212 | 2 ms | 4 ms | 0.00% | 58% | pass |
| coarse 13 | 1297 | 1815 | 2 ms | 8 ms | 0.00% | 61% | pass |
| coarse 14 | 1946 | 2524 | 501 ms | 948 ms | 38.55% | 92% | fail: p95 501 ms, errors 38.6% |
| fine 1 | 1427 | 1998 | 2 ms | 17 ms | 0.00% | 71% | pass |
| fine 2 | 1556 | 2179 | 3 ms | 24 ms | 0.00% | 77% | pass |
| fine 3 | 1686 | 2364 | 75 ms | 96 ms | 0.00% | 82% | pass |
| fine 4 | 1816 | 2462 | 208 ms | 262 ms | 17.34% | 90% | fail: errors 17.3% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 3003 | 299 ms | 343 ms | 55.39% |
| back at 1x | 2358 | 67 ms | 96 ms | 0.00% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
