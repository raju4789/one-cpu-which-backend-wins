# spring / none (quick run, for tuning only)

Run `spring-none-20261102-182803`, 2026-11-02T18:28:03+01:00 to 2026-11-02T18:45:03+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2261 req/s** | 1616 | 6457 | 1 ms | 24 ms | 62 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 18% | 341 MB |
| bench-cadvisor-1 | 0% | 40 MB |
| bench-nginx-1 | 7% | 55 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 50% | 488 MB |
| bench-postgres-exporter-1 | 0% | 17 MB |
| whole VM | 79% | 1491 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.05 cores, 3781 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.53 s (+0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 681,379 vs 681,378 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 91,979 posts stored for 91,979 acknowledged, 259,102 likes for 259,105 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 51f3535c33, stack 51f3535c33 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 1100 | 1542 | 2 ms | 4 ms | 0.00% | 63% | pass |
| coarse 2 | 1188 | 1663 | 2 ms | 6 ms | 0.00% | 64% | pass |
| coarse 3 | 1283 | 1798 | 2 ms | 11 ms | 0.00% | 67% | pass |
| coarse 4 | 1386 | 1941 | 2 ms | 19 ms | 0.00% | 69% | pass |
| coarse 5 | 1497 | 2098 | 2 ms | 24 ms | 0.00% | 72% | pass |
| coarse 6 | 1616 | 2261 | 24 ms | 62 ms | 0.00% | 79% | pass |
| coarse 7 | 1746 | 2397 | 312 ms | 495 ms | 10.66% | 95% | fail: p95 312 ms, errors 10.7% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2989 | 309 ms | 355 ms | 56.54% |
| back at 1x | 2263 | 10 ms | 61 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.53 s.
