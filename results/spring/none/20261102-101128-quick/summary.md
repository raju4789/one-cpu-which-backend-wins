# spring / none (quick run, for tuning only)

Run `spring-none-20261102-101128`, 2026-11-02T10:11:28+01:00 to 2026-11-02T10:28:33+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2260 req/s** | 1616 | 6473 | 1 ms | 24 ms | 65 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 17% | 315 MB |
| bench-cadvisor-1 | 0% | 21 MB |
| bench-nginx-1 | 7% | 51 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 52% | 493 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 73% | 1441 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.14 cores, 3778 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 681,492 vs 681,491 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 91,634 posts stored for 91,634 acknowledged, 258,867 likes for 258,874 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 581b0890d4, stack 581b0890d4 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 1100 | 1545 | 2 ms | 4 ms | 0.00% | 59% | pass |
| coarse 2 | 1188 | 1665 | 2 ms | 4 ms | 0.00% | 62% | pass |
| coarse 3 | 1283 | 1801 | 2 ms | 8 ms | 0.00% | 64% | pass |
| coarse 4 | 1386 | 1939 | 2 ms | 14 ms | 0.00% | 68% | pass |
| coarse 5 | 1497 | 2095 | 3 ms | 23 ms | 0.00% | 72% | pass |
| coarse 6 | 1616 | 2260 | 24 ms | 65 ms | 0.00% | 73% | pass |
| coarse 7 | 1746 | 2387 | 305 ms | 483 ms | 13.01% | 93% | fail: p95 305 ms, errors 13.0% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2990 | 306 ms | 348 ms | 56.52% |
| back at 1x | 2262 | 10 ms | 57 ms | 0.00% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
