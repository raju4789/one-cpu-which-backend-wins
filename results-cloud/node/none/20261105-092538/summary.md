# node / none

Run `node-none-20261105-092538`, 2026-11-05T09:25:38+00:00 to 2026-11-05T09:57:53+00:00

**Warning:** calibration 20.61 s is 275% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **100 req/s** | 71 | 286 | 10 ms | 51 ms | 132 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 28% | 133 MB |
| bench-cadvisor-1 | 1% | 25 MB |
| bench-nginx-1 | 4% | 31 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 28% | 454 MB |
| bench-postgres-exporter-1 | 1% | 11 MB |
| whole VM | 60% | 928 MB |

The Mac running k6 peaked at 13% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 13% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 219 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.61 s (+275.4% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 32,141 vs 32,140 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 32,076 vs 32,075 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 7,595 posts stored for 7,584 acknowledged, 23,083 likes for 23,054 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 19 ms | 31 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 16 ms | 34 ms | 0.00% | 18% | pass |
| coarse 3 | 22 | 30 | 22 ms | 40 ms | 0.00% | 24% | pass |
| coarse 4 | 34 | 47 | 34 ms | 333 ms | 0.00% | 37% | pass |
| coarse 5 | 51 | 71 | 51 ms | 149 ms | 0.00% | 47% | pass |
| coarse 6 | 76 | 105 | 1211 ms | 3549 ms | 3.58% | 73% | fail: p95 1211 ms, p99 3549 ms, errors 3.6% |
| fine 1 | 56 | 79 | 22 ms | 46 ms | 0.00% | 45% | pass |
| fine 2 | 61 | 86 | 58 ms | 287 ms | 0.00% | 53% | pass |
| fine 3 | 66 | 92 | 51 ms | 244 ms | 0.00% | 58% | pass |
| fine 4 | 71 | 99 | 73 ms | 407 ms | 0.00% | 63% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 149 | 569 ms | 722 ms | 0.00% |
| back at 1x | 99 | 32 ms | 73 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 20.61 s.
