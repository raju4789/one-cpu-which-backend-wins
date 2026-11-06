# spring / none

Run `spring-none-20261104-221221`, 2026-11-04T22:12:21+00:00 to 2026-11-04T22:44:03+00:00

**Warning:** calibration 22.85 s is 316% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **44 req/s** | 31 | 125 | 6 ms | 15 ms | 29 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 8% | 332 MB |
| bench-cadvisor-1 | 0% | 29 MB |
| bench-nginx-1 | 2% | 31 MB |
| bench-nginx-exporter-1 | 0% | 10 MB |
| bench-postgres-1 | 13% | 456 MB |
| bench-postgres-exporter-1 | 1% | 12 MB |
| whole VM | 23% | 1260 MB |

The Mac running k6 peaked at 10% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 10% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.2 cores, 119 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 22.85 s (+316.2% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 14,006 vs 14,005 (+0.01%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 14,103 vs 14,102 (+0.01%) | within 2% | ok |
| Writes stored (data check) | 3,468 posts stored for 3,468 acknowledged, 10,452 likes for 10,452 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 15 ms | 20 ms | 0.00% | 14% | pass |
| coarse 2 | 15 | 21 | 23 ms | 37 ms | 0.00% | 29% | pass |
| coarse 3 | 22 | 31 | 17 ms | 30 ms | 0.00% | 26% | pass |
| coarse 4 | 34 | 48 | 523 ms | 1259 ms | 0.00% | 46% | fail: p95 523 ms, p99 1259 ms |
| fine 1 | 24 | 34 | 17 ms | 36 ms | 0.00% | 25% | pass |
| fine 2 | 26 | 36 | 15 ms | 23 ms | 0.00% | 24% | pass |
| fine 3 | 29 | 40 | 16 ms | 29 ms | 0.00% | 22% | pass |
| fine 4 | 31 | 44 | 17 ms | 57 ms | 0.00% | 29% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 66 | 17 ms | 30 ms | 0.00% |
| back at 1x | 44 | 12 ms | 23 ms | 0.00% |

Recovered.

Idle baseline: the VM used 15% of the core with no load (monitoring agents and Postgres).
Calibration: 22.85 s.
