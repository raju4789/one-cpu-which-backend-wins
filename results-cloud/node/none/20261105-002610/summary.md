# node / none

Run `node-none-20261105-002610`, 2026-11-05T00:26:10+00:00 to 2026-11-05T00:59:26+00:00

**Warning:** calibration 19.71 s is 259% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **148 req/s** | 106 | 433 | 21 ms | 244 ms | 400 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 34% | 195 MB |
| bench-cadvisor-1 | 0% | 50 MB |
| bench-nginx-1 | 5% | 37 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 43% | 473 MB |
| bench-postgres-exporter-1 | 1% | 18 MB |
| whole VM | 85% | 1046 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 309 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 19.71 s (+259.0% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 47,818 vs 47,818 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 45,022 vs 45,022 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 11,256 posts stored for 11,208 acknowledged, 28,333 likes for 28,334 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 43614a0612 (node-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 16 ms | 26 ms | 0.00% | 14% | pass |
| coarse 2 | 15 | 21 | 18 ms | 32 ms | 0.00% | 22% | pass |
| coarse 3 | 22 | 31 | 22 ms | 63 ms | 0.00% | 25% | pass |
| coarse 4 | 34 | 48 | 79 ms | 357 ms | 0.00% | 39% | pass |
| coarse 5 | 51 | 71 | 51 ms | 419 ms | 0.00% | 50% | pass |
| coarse 6 | 76 | 108 | 99 ms | 519 ms | 0.00% | 70% | pass |
| coarse 7 | 114 | 159 | 1008 ms | 1087 ms | 0.00% | 90% | fail: p95 1008 ms, p99 1087 ms |
| fine 1 | 84 | 118 | 39 ms | 76 ms | 0.00% | 67% | pass |
| fine 2 | 91 | 128 | 68 ms | 305 ms | 0.00% | 72% | pass |
| fine 3 | 99 | 137 | 138 ms | 490 ms | 0.00% | 78% | pass |
| fine 4 | 106 | 148 | 253 ms | 543 ms | 0.00% | 76% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 198 | 3648 ms | 3859 ms | 21.63% |
| back at 1x | 148 | 682 ms | 1552 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 12% of the core with no load (monitoring agents and Postgres).
Calibration: 19.71 s.
