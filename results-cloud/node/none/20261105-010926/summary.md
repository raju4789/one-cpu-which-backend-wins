# node / none

Run `node-none-20261105-010926`, 2026-11-05T01:09:26+00:00 to 2026-11-05T01:48:58+00:00

**Warning:** calibration 21.69 s is 295% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **106 req/s** | 76 | 306 | 9 ms | 52 ms | 276 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 26% | 146 MB |
| bench-cadvisor-1 | 0% | 22 MB |
| bench-nginx-1 | 4% | 32 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 29% | 464 MB |
| bench-postgres-exporter-1 | 1% | 9 MB |
| whole VM | 62% | 957 MB |

The Mac running k6 peaked at 11% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 11% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 232 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.69 s (+295.1% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 34,283 vs 34,282 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 34,238 vs 34,237 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 12,093 posts stored for 12,069 acknowledged, 35,644 likes for 35,597 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 16 ms | 37 ms | 0.00% | 13% | pass |
| coarse 2 | 15 | 21 | 17 ms | 27 ms | 0.00% | 17% | pass |
| coarse 3 | 22 | 30 | 16 ms | 39 ms | 0.00% | 23% | pass |
| coarse 4 | 34 | 48 | 19 ms | 34 ms | 0.00% | 34% | pass |
| coarse 5 | 51 | 71 | 23 ms | 81 ms | 0.00% | 43% | pass |
| coarse 6 | 76 | 105 | 289 ms | 898 ms | 0.00% | 60% | pass |
| coarse 7 | 114 | 159 | 251 ms | 651 ms | 0.00% | 88% | pass |
| coarse 8 | 171 | 221 | 1202 ms | 1335 ms | 34.45% | 87% | fail: p95 1202 ms, p99 1335 ms, errors 34.5% |
| fine 1 | 125 | 171 | 1456 ms | 7644 ms | 9.96% | 84% | fail: p95 1456 ms, p99 7644 ms, errors 10.0% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 159 | 1035 ms | 1114 ms | 1.25% |
| back at 1x | 107 | 39 ms | 89 ms | 0.00% |

Recovered.

Idle baseline: the VM used 12% of the core with no load (monitoring agents and Postgres).
Calibration: 21.69 s.
