# rails / app

Run `rails-app-20261105-121754`, 2026-11-05T12:17:54+00:00 to 2026-11-05T12:50:33+00:00

**Warning:** calibration 22.71 s is 314% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **99 req/s** | 71 | 285 | 6 ms | 25 ms | 46 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 27% | 111 MB |
| bench-cadvisor-1 | 1% | 23 MB |
| bench-nginx-1 | 5% | 32 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 7% | 432 MB |
| bench-postgres-exporter-1 | 1% | 9 MB |
| whole VM | 39% | 881 MB |

The Mac running k6 peaked at 12% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 12% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 220 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 22.71 s (+313.7% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 32,064 vs 32,064 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 31,953 vs 31,952 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 7,596 posts stored for 7,594 acknowledged, 22,981 likes for 22,982 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 17 ms | 26 ms | 0.00% | 17% | pass |
| coarse 2 | 15 | 21 | 17 ms | 27 ms | 0.00% | 16% | pass |
| coarse 3 | 22 | 31 | 19 ms | 33 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 47 | 23 ms | 64 ms | 0.00% | 24% | pass |
| coarse 5 | 51 | 71 | 25 ms | 50 ms | 0.00% | 35% | pass |
| coarse 6 | 76 | 106 | 393 ms | 638 ms | 0.00% | 51% | fail: p95 393 ms |
| fine 1 | 56 | 78 | 25 ms | 42 ms | 0.00% | 34% | pass |
| fine 2 | 61 | 85 | 26 ms | 142 ms | 0.00% | 39% | pass |
| fine 3 | 66 | 92 | 28 ms | 157 ms | 0.00% | 36% | pass |
| fine 4 | 71 | 100 | 35 ms | 165 ms | 0.00% | 42% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 150 | 48 ms | 89 ms | 0.00% |
| back at 1x | 98 | 27 ms | 49 ms | 0.00% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 22.71 s.
