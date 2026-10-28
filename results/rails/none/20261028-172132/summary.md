# rails / none

Run `rails-none-20261028-172132`, 2026-10-28T17:21:32+01:00 to 2026-10-28T17:56:03+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1212 req/s** | 865 | 3467 | 2 ms | 24 ms | 82 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 52% | 135 MB |
| bench-cadvisor-1 | 0% | 41 MB |
| bench-nginx-1 | 5% | 48 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 28% | 545 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 85% | 1277 MB |

The Mac running k6 peaked at 19% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 19% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.75 cores, 2225 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 390,775 vs 390,775 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 289,459 vs 286,743 (+0.95%) | within 2% | ok |
| Writes stored (data check) | 72,332 posts stored for 72,306 acknowledged, 212,355 likes for 212,297 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 11 ms | 15 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 10 ms | 14 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 11 ms | 15 ms | 0.00% | 21% | pass |
| coarse 4 | 34 | 47 | 12 ms | 15 ms | 0.00% | 29% | pass |
| coarse 5 | 51 | 71 | 11 ms | 14 ms | 0.00% | 40% | pass |
| coarse 6 | 76 | 107 | 10 ms | 15 ms | 0.00% | 42% | pass |
| coarse 7 | 114 | 160 | 9 ms | 12 ms | 0.00% | 51% | pass |
| coarse 8 | 171 | 240 | 7 ms | 11 ms | 0.00% | 54% | pass |
| coarse 9 | 256 | 358 | 5 ms | 8 ms | 0.00% | 60% | pass |
| coarse 10 | 384 | 540 | 3 ms | 5 ms | 0.00% | 60% | pass |
| coarse 11 | 577 | 810 | 3 ms | 10 ms | 0.00% | 62% | pass |
| coarse 12 | 865 | 1207 | 87 ms | 121 ms | 0.00% | 83% | pass |
| coarse 13 | 1297 | 998 | 1090 ms | 1290 ms | 0.96% | 94% | fail: p95 1090 ms, p99 1290 ms, k6 dropped 42.4% of sessions |
| fine 1 | 952 | 1098 | 1085 ms | 17812 ms | 0.81% | 90% | fail: p95 1085 ms, p99 17812 ms, k6 dropped 10.0% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1075 | 59997 ms | 60008 ms | 7.70% |
| back at 1x | 1047 | 33038 ms | 59996 ms | 4.19% |

Did not recover within 2 minutes.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
