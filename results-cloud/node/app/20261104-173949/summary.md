# node / app

Run `node-app-20261104-173949`, 2026-11-04T17:39:49+00:00 to 2026-11-04T18:16:23+00:00

**Warning:** calibration 21.62 s is 294% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **466 req/s** | 333 | 1344 | 9 ms | 101 ms | 269 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 49% | 137 MB |
| bench-cadvisor-1 | 0% | 25 MB |
| bench-nginx-1 | 12% | 37 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 18% | 487 MB |
| bench-postgres-exporter-1 | 1% | 11 MB |
| whole VM | 81% | 988 MB |

The Mac running k6 peaked at 25% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 25% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.0 cores, 882 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.62 s (+293.8% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 150,344 vs 150,344 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 142,402 vs 142,401 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 35,853 posts stored for 35,816 acknowledged, 106,785 likes for 106,634 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 17 ms | 26 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 15 ms | 27 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 31 | 15 ms | 30 ms | 0.00% | 17% | pass |
| coarse 4 | 34 | 47 | 17 ms | 34 ms | 0.00% | 21% | pass |
| coarse 5 | 51 | 71 | 14 ms | 26 ms | 0.00% | 24% | pass |
| coarse 6 | 76 | 107 | 25 ms | 48 ms | 0.00% | 35% | pass |
| coarse 7 | 114 | 158 | 51 ms | 188 ms | 0.00% | 45% | pass |
| coarse 8 | 171 | 240 | 43 ms | 122 ms | 0.00% | 62% | pass |
| coarse 9 | 256 | 358 | 70 ms | 342 ms | 0.00% | 78% | pass |
| coarse 10 | 384 | 537 | 547 ms | 1981 ms | 0.00% | 93% | fail: p95 547 ms, p99 1981 ms |
| fine 1 | 282 | 396 | 77 ms | 223 ms | 0.00% | 81% | pass |
| fine 2 | 307 | 427 | 68 ms | 401 ms | 0.00% | 80% | pass |
| fine 3 | 333 | 466 | 108 ms | 503 ms | 0.00% | 81% | pass |
| fine 4 | 358 | 494 | 8000 ms | 12507 ms | 0.09% | 89% | fail: p95 8000 ms, p99 12507 ms, k6 dropped 1.7% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 629 | 15006 ms | 57826 ms | 3.60% |
| back at 1x | 467 | 184 ms | 407 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 21.62 s.
