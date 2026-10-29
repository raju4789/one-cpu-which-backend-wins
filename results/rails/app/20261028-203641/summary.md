# rails / app

Run `rails-app-20261028-203641`, 2026-10-28T20:36:41+01:00 to 2026-10-28T21:15:10+01:00

**Warning:** overload: Nginx counted 469243 requests but k6 recorded 455125 (+3.1%). One of them is wrong, most likely k6: don't trust this test's numbers

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2542 req/s** | 1816 | 7277 | 2 ms | 25 ms | 96 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 61% | 118 MB |
| bench-cadvisor-1 | 0% | 30 MB |
| bench-nginx-1 | 10% | 59 MB |
| bench-nginx-exporter-1 | 0% | 12 MB |
| bench-postgres-1 | 12% | 591 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 86% | 1278 MB |

The Mac running k6 peaked at 47% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 47% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.08 cores, 4617 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 819,404 vs 819,404 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 469,243 vs 455,125 (+3.10%) | within 2% | **FAIL** |
| Writes stored (data check) | 157,141 posts stored for 156,945 acknowledged, 463,029 likes for 462,512 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 10 ms | 0.00% | 7% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 3 | 22 | 30 | 8 ms | 10 ms | 0.00% | 11% | pass |
| coarse 4 | 34 | 47 | 8 ms | 11 ms | 0.00% | 16% | pass |
| coarse 5 | 51 | 72 | 9 ms | 13 ms | 0.00% | 22% | pass |
| coarse 6 | 76 | 108 | 9 ms | 13 ms | 0.00% | 31% | pass |
| coarse 7 | 114 | 159 | 10 ms | 15 ms | 0.00% | 40% | pass |
| coarse 8 | 171 | 238 | 8 ms | 12 ms | 0.00% | 45% | pass |
| coarse 9 | 256 | 358 | 7 ms | 10 ms | 0.00% | 47% | pass |
| coarse 10 | 384 | 539 | 6 ms | 9 ms | 0.00% | 50% | pass |
| coarse 11 | 577 | 807 | 5 ms | 7 ms | 0.00% | 53% | pass |
| coarse 12 | 865 | 1210 | 3 ms | 6 ms | 0.00% | 52% | pass |
| coarse 13 | 1297 | 1817 | 2 ms | 4 ms | 0.00% | 57% | pass |
| coarse 14 | 1946 | 1676 | 8275 ms | 27441 ms | 0.57% | 95% | fail: p95 8275 ms, p99 27441 ms, k6 dropped 29.1% of sessions |
| fine 1 | 1427 | 1997 | 2 ms | 6 ms | 0.00% | 62% | pass |
| fine 2 | 1556 | 2176 | 3 ms | 14 ms | 0.00% | 68% | pass |
| fine 3 | 1686 | 2365 | 4 ms | 24 ms | 0.00% | 75% | pass |
| fine 4 | 1816 | 2545 | 44 ms | 94 ms | 0.00% | 89% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1458 | 60000 ms | 60001 ms | 12.20% |
| back at 1x | 1739 | 60000 ms | 60000 ms | 6.67% |

Did not recover within 2 minutes.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
