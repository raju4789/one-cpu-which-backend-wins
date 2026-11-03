# spring / none (quick run, for tuning only)

Run `spring-none-20261102-093843`, 2026-11-02T09:38:43+01:00 to 2026-11-02T09:55:42+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2263 req/s** | 1616 | 6474 | 1 ms | 12 ms | 49 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 17% | 348 MB |
| bench-cadvisor-1 | 0% | 28 MB |
| bench-nginx-1 | 7% | 54 MB |
| bench-nginx-exporter-1 | 0% | 8 MB |
| bench-postgres-1 | 52% | 493 MB |
| bench-postgres-exporter-1 | 0% | 9 MB |
| whole VM | 73% | 1518 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.15 cores, 3792 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 607,112 vs 607,111 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 105,165 posts stored for 105,165 acknowledged, 313,952 likes for 313,962 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 3908b0d772, stack 3908b0d772 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 1100 | 1542 | 2 ms | 6 ms | 0.00% | 60% | pass |
| coarse 2 | 1188 | 1662 | 1 ms | 4 ms | 0.00% | 60% | pass |
| coarse 3 | 1283 | 1801 | 2 ms | 19 ms | 0.00% | 64% | pass |
| coarse 4 | 1386 | 1943 | 2 ms | 9 ms | 0.00% | 64% | pass |
| coarse 5 | 1497 | 2095 | 3 ms | 34 ms | 0.00% | 74% | pass |
| coarse 6 | 1616 | 2263 | 12 ms | 49 ms | 0.00% | 73% | pass |
| coarse 7 | 1746 | 2442 | 829 ms | 937 ms | 0.00% | 93% | fail: p95 829 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2333 | 1620 ms | 1732 ms | 0.00% |
| back at 1x | 2263 | 617 ms | 982 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
