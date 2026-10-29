# rails / none (quick run, for tuning only)

Run `rails-none-20261028-071848`, 2026-10-28T07:18:48+01:00 to 2026-10-28T07:35:35+01:00

**Warning:** uncommitted changes (stacks/rails/Gemfile.lock): this run can't be reproduced from a commit

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1231 req/s** | 879 | 3543 | 3 ms | 93 ms | 123 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 55% | 118 MB |
| bench-cadvisor-1 | 0% | 28 MB |
| bench-nginx-1 | 5% | 46 MB |
| bench-nginx-exporter-1 | 0% | 8 MB |
| bench-postgres-1 | 30% | 447 MB |
| bench-postgres-exporter-1 | 0% | 11 MB |
| whole VM | 86% | 1120 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.85 cores, 2634 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.62 s (+2.4% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 294,226 vs 292,164 (+0.71%) | within 2% | ok |
| Writes stored (data check) | 47,339 posts stored for 47,333 acknowledged, 133,341 likes for 133,325 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 75685e5ef7, stack 75685e5ef7, uncommitted changes | everything committed | **FAIL** |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 906 | 3 ms | 10 ms | 0.00% | 67% | pass |
| coarse 2 | 698 | 979 | 5 ms | 49 ms | 0.00% | 73% | pass |
| coarse 3 | 753 | 1051 | 7 ms | 32 ms | 0.00% | 77% | pass |
| coarse 4 | 814 | 1140 | 171 ms | 268 ms | 0.00% | 88% | pass |
| coarse 5 | 879 | 1231 | 93 ms | 123 ms | 0.00% | 86% | pass |
| coarse 6 | 949 | 1041 | 1064 ms | 1089 ms | 6.35% | 98% | fail: p95 1064 ms, p99 1089 ms, errors 6.3%, k6 dropped 15.3% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1078 | 60000 ms | 60000 ms | 13.90% |
| back at 1x | 1089 | 24824 ms | 60000 ms | 18.14% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.62 s.
