# node / nginx

Run `node-nginx-20261104-182623`, 2026-11-04T18:26:23+00:00 to 2026-11-04T19:00:57+00:00

**Warning:** calibration 21.47 s is 291% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **394 req/s** | 282 | 1137 | 2 ms | 105 ms | 319 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 39% | 176 MB |
| bench-cadvisor-1 | 1% | 24 MB |
| bench-nginx-1 | 13% | 38 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 20% | 472 MB |
| bench-postgres-exporter-1 | 1% | 10 MB |
| whole VM | 73% | 962 MB |

The Mac running k6 peaked at 26% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 26% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.0 cores, 753 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.47 s (+291.1% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 127,102 vs 127,102 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 126,388 vs 126,387 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 27,214 posts stored for 27,113 acknowledged, 80,403 likes for 80,120 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 14 ms | 27 ms | 0.00% | 8% | pass |
| coarse 2 | 15 | 21 | 16 ms | 28 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 31 | 16 ms | 30 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 47 | 17 ms | 33 ms | 0.00% | 18% | pass |
| coarse 5 | 51 | 71 | 16 ms | 30 ms | 0.00% | 22% | pass |
| coarse 6 | 76 | 106 | 18 ms | 46 ms | 0.00% | 31% | pass |
| coarse 7 | 114 | 159 | 22 ms | 65 ms | 0.00% | 40% | pass |
| coarse 8 | 171 | 238 | 67 ms | 626 ms | 0.00% | 55% | pass |
| coarse 9 | 256 | 360 | 128 ms | 910 ms | 0.00% | 72% | pass |
| coarse 10 | 384 | 532 | 2821 ms | 6182 ms | 10.95% | 88% | fail: p95 2821 ms, p99 6182 ms, errors 11.0% |
| fine 1 | 282 | 395 | 76 ms | 231 ms | 0.00% | 73% | pass |
| fine 2 | 307 | 429 | 1180 ms | 4690 ms | 2.44% | 90% | fail: p95 1180 ms, p99 4690 ms, errors 2.4% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 585 | 2807 ms | 6559 ms | 12.46% |
| back at 1x | 395 | 156 ms | 421 ms | 0.00% |

Recovered.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 21.47 s.
