# rails / app

Run `rails-app-20261104-195857`, 2026-11-04T19:58:58+00:00 to 2026-11-04T20:31:29+00:00

**Warning:** calibration 22.56 s is 311% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **99 req/s** | 71 | 285 | 5 ms | 19 ms | 37 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 25% | 122 MB |
| bench-cadvisor-1 | 0% | 50 MB |
| bench-nginx-1 | 5% | 35 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 6% | 438 MB |
| bench-postgres-exporter-1 | 1% | 14 MB |
| whole VM | 38% | 944 MB |

The Mac running k6 peaked at 12% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 12% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 221 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 22.56 s (+310.9% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 32,058 vs 32,057 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 32,121 vs 32,120 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 7,688 posts stored for 7,687 acknowledged, 22,968 likes for 22,967 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 14 ms | 22 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 17 ms | 36 ms | 0.00% | 17% | pass |
| coarse 3 | 22 | 31 | 14 ms | 26 ms | 0.00% | 15% | pass |
| coarse 4 | 34 | 47 | 19 ms | 91 ms | 0.00% | 29% | pass |
| coarse 5 | 51 | 71 | 18 ms | 62 ms | 0.00% | 34% | pass |
| coarse 6 | 76 | 106 | 394 ms | 495 ms | 0.00% | 49% | fail: p95 394 ms |
| fine 1 | 56 | 79 | 15 ms | 26 ms | 0.00% | 32% | pass |
| fine 2 | 61 | 85 | 27 ms | 86 ms | 0.00% | 36% | pass |
| fine 3 | 66 | 92 | 24 ms | 56 ms | 0.00% | 33% | pass |
| fine 4 | 71 | 100 | 257 ms | 647 ms | 0.00% | 45% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 151 | 25 ms | 55 ms | 0.00% |
| back at 1x | 99 | 27 ms | 51 ms | 0.00% |

Recovered.

Idle baseline: the VM used 18% of the core with no load (monitoring agents and Postgres).
Calibration: 22.56 s.
