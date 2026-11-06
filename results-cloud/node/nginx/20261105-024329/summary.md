# node / nginx

Run `node-nginx-20261105-024329`, 2026-11-05T02:43:29+00:00 to 2026-11-05T03:16:57+00:00

**Warning:** calibration 20.70 s is 277% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **358 req/s** | 256 | 1029 | 2 ms | 53 ms | 180 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 36% | 129 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 12% | 35 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 16% | 467 MB |
| bench-postgres-exporter-1 | 1% | 8 MB |
| whole VM | 65% | 931 MB |

The Mac running k6 peaked at 23% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 23% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.8 cores, 692 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.70 s (+277.0% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 115,551 vs 115,551 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 114,759 vs 114,758 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 24,638 posts stored for 24,555 acknowledged, 72,729 likes for 72,511 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 13 ms | 24 ms | 0.00% | 8% | pass |
| coarse 2 | 15 | 21 | 17 ms | 46 ms | 0.00% | 13% | pass |
| coarse 3 | 22 | 31 | 16 ms | 30 ms | 0.00% | 15% | pass |
| coarse 4 | 34 | 48 | 15 ms | 43 ms | 0.00% | 19% | pass |
| coarse 5 | 51 | 71 | 14 ms | 27 ms | 0.00% | 22% | pass |
| coarse 6 | 76 | 105 | 19 ms | 62 ms | 0.00% | 29% | pass |
| coarse 7 | 114 | 160 | 23 ms | 148 ms | 0.00% | 40% | pass |
| coarse 8 | 171 | 238 | 47 ms | 237 ms | 0.00% | 56% | pass |
| coarse 9 | 256 | 361 | 153 ms | 931 ms | 0.38% | 78% | pass |
| coarse 10 | 384 | 533 | 2525 ms | 10299 ms | 9.13% | 94% | fail: p95 2525 ms, p99 10299 ms, errors 9.1% |
| fine 1 | 282 | 395 | 937 ms | 1531 ms | 1.13% | 81% | fail: p95 937 ms, p99 1531 ms, errors 1.1% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 532 | 1194 ms | 4148 ms | 5.78% |
| back at 1x | 358 | 96 ms | 528 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 20.7 s.
