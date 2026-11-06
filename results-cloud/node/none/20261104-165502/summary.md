# node / none

Run `node-none-20261104-165502`, 2026-11-04T16:55:02+00:00 to 2026-11-04T17:29:49+00:00

**Warning:** calibration 19.77 s is 260% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **99 req/s** | 71 | 285 | 8 ms | 46 ms | 221 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 24% | 128 MB |
| bench-cadvisor-1 | 0% | 52 MB |
| bench-nginx-1 | 4% | 39 MB |
| bench-nginx-exporter-1 | 0% | 19 MB |
| bench-postgres-1 | 26% | 454 MB |
| bench-postgres-exporter-1 | 0% | 19 MB |
| whole VM | 56% | 1066 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 218 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 19.77 s (+260.1% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 31,987 vs 31,986 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 32,164 vs 32,163 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 7,746 posts stored for 7,741 acknowledged, 22,993 likes for 22,961 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 19 ms | 44 ms | 0.00% | 19% | pass |
| coarse 2 | 15 | 21 | 20 ms | 44 ms | 0.00% | 20% | pass |
| coarse 3 | 22 | 31 | 24 ms | 57 ms | 0.00% | 24% | pass |
| coarse 4 | 34 | 48 | 41 ms | 131 ms | 0.00% | 44% | pass |
| coarse 5 | 51 | 72 | 39 ms | 247 ms | 0.00% | 48% | pass |
| coarse 6 | 76 | 106 | 463 ms | 1041 ms | 0.00% | 66% | fail: p95 463 ms, p99 1041 ms |
| fine 1 | 56 | 78 | 36 ms | 108 ms | 0.00% | 46% | pass |
| fine 2 | 61 | 86 | 44 ms | 124 ms | 0.00% | 52% | pass |
| fine 3 | 66 | 92 | 42 ms | 162 ms | 0.00% | 53% | pass |
| fine 4 | 71 | 99 | 43 ms | 111 ms | 0.00% | 56% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 150 | 93 ms | 163 ms | 0.00% |
| back at 1x | 100 | 28 ms | 71 ms | 0.00% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 19.77 s.
