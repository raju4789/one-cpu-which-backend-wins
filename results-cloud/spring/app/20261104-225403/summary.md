# spring / app

Run `spring-app-20261104-225403`, 2026-11-04T22:54:03+00:00 to 2026-11-04T23:30:06+00:00

**Warning:** calibration 21.86 s is 298% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **335 req/s** | 239 | 957 | 2 ms | 15 ms | 29 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 25% | 339 MB |
| bench-cadvisor-1 | 0% | 41 MB |
| bench-nginx-1 | 11% | 38 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 12% | 487 MB |
| bench-postgres-exporter-1 | 1% | 13 MB |
| whole VM | 52% | 1185 MB |

The Mac running k6 peaked at 22% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 22% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.8 cores, 643 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.86 s (+298.2% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 107,790 vs 107,790 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 108,070 vs 108,069 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 25,605 posts stored for 25,581 acknowledged, 76,589 likes for 76,524 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 20 ms | 29 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 17 ms | 29 ms | 0.00% | 19% | pass |
| coarse 3 | 22 | 31 | 14 ms | 25 ms | 0.00% | 23% | pass |
| coarse 4 | 34 | 48 | 12 ms | 23 ms | 0.00% | 26% | pass |
| coarse 5 | 51 | 71 | 13 ms | 23 ms | 0.00% | 37% | pass |
| coarse 6 | 76 | 106 | 14 ms | 30 ms | 0.00% | 31% | pass |
| coarse 7 | 114 | 159 | 13 ms | 25 ms | 0.00% | 41% | pass |
| coarse 8 | 171 | 239 | 39 ms | 227 ms | 0.00% | 56% | pass |
| coarse 9 | 256 | 357 | 1984 ms | 4475 ms | 0.15% | 80% | fail: p95 1984 ms, p99 4475 ms |
| fine 1 | 188 | 264 | 16 ms | 33 ms | 0.00% | 56% | pass |
| fine 2 | 205 | 287 | 28 ms | 101 ms | 0.00% | 55% | pass |
| fine 3 | 222 | 313 | 17 ms | 47 ms | 0.00% | 55% | pass |
| fine 4 | 239 | 334 | 24 ms | 310 ms | 0.00% | 50% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 502 | 20 ms | 40 ms | 0.00% |
| back at 1x | 335 | 13 ms | 27 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 21.86 s.
