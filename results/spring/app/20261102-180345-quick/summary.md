# spring / app (quick run, for tuning only)

Run `spring-app-20261102-180345`, 2026-11-02T18:03:45+01:00 to 2026-11-02T18:18:03+01:00

**Warning:** calibration 5.75 s is 5% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **5722 req/s** | 4082 | 16351 | 1 ms | 18 ms | 83 ms | 0.02% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 35% | 368 MB |
| bench-cadvisor-1 | 0% | 32 MB |
| bench-nginx-1 | 23% | 73 MB |
| bench-nginx-exporter-1 | 0% | 9 MB |
| bench-postgres-1 | 25% | 489 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 84% | 1475 MB |

The Mac running k6 peaked at 22% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 22% | < 70% | ok |
| Mac memory compressed during the run | 0.1 GB | < 2 GB | ok |
| k6 process, peak | 2.18 cores, 7460 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.75 s (+4.7% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (overload) | 1,488,526 vs 1,487,473 (+0.07%) | within 2% | ok |
| Writes stored (data check) | 199,237 posts stored for 199,180 acknowledged, 590,486 likes for 590,653 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 51f3535c33, stack 51f3535c33 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 3500 | 4901 | 3 ms | 13 ms | 0.00% | 70% | pass |
| coarse 2 | 3780 | 5296 | 4 ms | 14 ms | 0.00% | 80% | pass |
| coarse 3 | 4082 | 5722 | 18 ms | 83 ms | 0.02% | 84% | pass |
| coarse 4 | 4409 | 5559 | 1241 ms | 4766 ms | 3.11% | 90% | fail: p95 1241 ms, p99 4766 ms, errors 3.1%, k6 dropped 8.7% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 5630 | 1437 ms | 8906 ms | 4.58% |
| back at 1x | 5619 | 1286 ms | 5745 ms | 4.33% |

Did not recover within 2 minutes.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.75 s.
