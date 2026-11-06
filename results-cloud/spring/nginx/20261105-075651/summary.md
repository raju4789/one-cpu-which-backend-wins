# spring / nginx

Run `spring-nginx-20261105-075651`, 2026-11-05T07:56:51+00:00 to 2026-11-05T08:34:06+00:00

**Warning:** calibration 21.68 s is 295% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **645 req/s** | 461 | 1855 | 2 ms | 79 ms | 299 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 28% | 441 MB |
| bench-cadvisor-1 | 1% | 43 MB |
| bench-nginx-1 | 18% | 42 MB |
| bench-nginx-exporter-1 | 0% | 13 MB |
| bench-postgres-1 | 26% | 494 MB |
| bench-postgres-exporter-1 | 1% | 11 MB |
| whole VM | 74% | 1333 MB |

The Mac running k6 peaked at 27% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 27% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.0 cores, 1206 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.68 s (+294.9% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 208,102 vs 208,101 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 204,559 vs 204,560 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 46,188 posts stored for 45,765 acknowledged, 138,162 likes for 136,815 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 17 ms | 31 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 17 ms | 34 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 30 | 17 ms | 35 ms | 0.00% | 14% | pass |
| coarse 4 | 34 | 48 | 16 ms | 25 ms | 0.00% | 20% | pass |
| coarse 5 | 51 | 72 | 13 ms | 22 ms | 0.00% | 26% | pass |
| coarse 6 | 76 | 106 | 13 ms | 28 ms | 0.00% | 37% | pass |
| coarse 7 | 114 | 160 | 15 ms | 32 ms | 0.00% | 35% | pass |
| coarse 8 | 171 | 239 | 47 ms | 483 ms | 0.00% | 52% | pass |
| coarse 9 | 256 | 360 | 41 ms | 471 ms | 0.00% | 65% | pass |
| coarse 10 | 384 | 539 | 102 ms | 838 ms | 0.00% | 78% | pass |
| coarse 11 | 577 | 804 | 5512 ms | 7948 ms | 4.90% | 94% | fail: p95 5512 ms, p99 7948 ms, errors 4.9% |
| fine 1 | 422 | 588 | 53 ms | 187 ms | 0.00% | 78% | pass |
| fine 2 | 461 | 648 | 100 ms | 481 ms | 0.00% | 83% | pass |
| fine 3 | 499 | 697 | 1999 ms | 4239 ms | 2.57% | 83% | fail: p95 1999 ms, p99 4239 ms, errors 2.6% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 935 | 10002 ms | 12131 ms | 11.76% |
| back at 1x | 647 | 42 ms | 156 ms | 0.00% |

Recovered.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 21.68 s.
