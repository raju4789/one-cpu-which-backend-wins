# spring / none (quick run, for tuning only)

Run `spring-none-20261102-123335`, 2026-11-02T12:33:35+01:00 to 2026-11-02T12:50:40+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2263 req/s** | 1616 | 6470 | 1 ms | 19 ms | 53 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 17% | 349 MB |
| bench-cadvisor-1 | 0% | 22 MB |
| bench-nginx-1 | 8% | 52 MB |
| bench-nginx-exporter-1 | 0% | 11 MB |
| bench-postgres-1 | 50% | 495 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 79% | 1450 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.1 cores, 3759 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 680,616 vs 680,615 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 92,390 posts stored for 92,390 acknowledged, 261,422 likes for 261,430 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness cbad5bf872, stack cbad5bf872 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 1100 | 1535 | 2 ms | 6 ms | 0.00% | 64% | pass |
| coarse 2 | 1188 | 1662 | 1 ms | 4 ms | 0.00% | 57% | pass |
| coarse 3 | 1283 | 1796 | 2 ms | 11 ms | 0.00% | 66% | pass |
| coarse 4 | 1386 | 1940 | 2 ms | 10 ms | 0.00% | 69% | pass |
| coarse 5 | 1497 | 2097 | 3 ms | 42 ms | 0.00% | 75% | pass |
| coarse 6 | 1616 | 2263 | 19 ms | 53 ms | 0.00% | 79% | pass |
| coarse 7 | 1746 | 2414 | 231 ms | 413 ms | 5.53% | 92% | fail: errors 5.5% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2988 | 292 ms | 334 ms | 56.47% |
| back at 1x | 2258 | 6 ms | 52 ms | 0.00% |

Recovered.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
