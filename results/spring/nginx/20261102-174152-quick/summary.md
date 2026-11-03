# spring / nginx (quick run, for tuning only)

Run `spring-nginx-20261102-174152`, 2026-11-02T17:41:52+01:00 to 2026-11-02T17:58:58+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **6663 req/s** | 4761 | 19035 | 0 ms | 6 ms | 17 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 25% | 310 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 28% | 74 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 28% | 541 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 84% | 1404 MB |

The Mac running k6 peaked at 24% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 24% | < 70% | ok |
| Mac memory compressed during the run | 0.1 GB | < 2 GB | ok |
| k6 process, peak | 2.23 cores, 7681 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 1,763,958 vs 1,763,957 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 289,849 posts stored for 289,849 acknowledged, 865,652 likes for 866,687 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 22d0e4c43f, stack 22d0e4c43f | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 3000 | 4197 | 2 ms | 4 ms | 0.00% | 60% | pass |
| coarse 2 | 3240 | 4537 | 2 ms | 5 ms | 0.00% | 62% | pass |
| coarse 3 | 3499 | 4904 | 2 ms | 5 ms | 0.00% | 66% | pass |
| coarse 4 | 3779 | 5289 | 2 ms | 7 ms | 0.00% | 73% | pass |
| coarse 5 | 4081 | 5709 | 3 ms | 7 ms | 0.00% | 69% | pass |
| coarse 6 | 4408 | 6180 | 4 ms | 28 ms | 0.00% | 82% | pass |
| coarse 7 | 4761 | 6663 | 6 ms | 17 ms | 0.00% | 84% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 6763 | 581 ms | 1582 ms | 2.49% |
| back at 1x | 6663 | 6 ms | 20 ms | 0.00% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
