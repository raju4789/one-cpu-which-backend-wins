# spring / none

Run `spring-none-20261105-062714`, 2026-11-05T06:27:14+00:00 to 2026-11-05T07:00:44+00:00

**Warning:** calibration 24.27 s is 342% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **100 req/s** | 71 | 286 | 10 ms | 35 ms | 61 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 20% | 333 MB |
| bench-cadvisor-1 | 1% | 43 MB |
| bench-nginx-1 | 6% | 35 MB |
| bench-nginx-exporter-1 | 0% | 12 MB |
| bench-postgres-1 | 31% | 461 MB |
| bench-postgres-exporter-1 | 1% | 14 MB |
| whole VM | 52% | 1157 MB |

The Mac running k6 peaked at 13% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 13% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 220 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.27 s (+342.1% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 32,189 vs 32,189 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 32,081 vs 32,080 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 7,761 posts stored for 7,750 acknowledged, 23,279 likes for 23,242 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 25 ms | 40 ms | 0.00% | 17% | pass |
| coarse 2 | 15 | 21 | 34 ms | 79 ms | 0.00% | 35% | pass |
| coarse 3 | 22 | 31 | 25 ms | 46 ms | 0.00% | 36% | pass |
| coarse 4 | 34 | 48 | 31 ms | 87 ms | 0.00% | 42% | pass |
| coarse 5 | 51 | 71 | 30 ms | 53 ms | 0.00% | 54% | pass |
| coarse 6 | 76 | 107 | 1773 ms | 2345 ms | 0.00% | 68% | fail: p95 1773 ms, p99 2345 ms |
| fine 1 | 56 | 78 | 22 ms | 40 ms | 0.00% | 47% | pass |
| fine 2 | 61 | 85 | 32 ms | 148 ms | 0.00% | 47% | pass |
| fine 3 | 66 | 93 | 33 ms | 62 ms | 0.00% | 53% | pass |
| fine 4 | 71 | 99 | 72 ms | 164 ms | 0.00% | 55% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 150 | 115 ms | 337 ms | 0.00% |
| back at 1x | 99 | 113 ms | 308 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 24.27 s.
