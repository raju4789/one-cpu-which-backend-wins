# rails / nginx

Run `rails-nginx-20261028-185433`, 2026-10-28T18:54:33+01:00 to 2026-10-28T19:42:08+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **3543 req/s** | 2530 | 10118 | 0 ms | 4 ms | 12 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 41% | 131 MB |
| bench-cadvisor-1 | 0% | 40 MB |
| bench-nginx-1 | 13% | 68 MB |
| bench-nginx-exporter-1 | 0% | 11 MB |
| bench-postgres-1 | 18% | 628 MB |
| bench-postgres-exporter-1 | 0% | 9 MB |
| whole VM | 74% | 1293 MB |

The Mac running k6 peaked at 20% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 20% | < 70% | ok |
| Mac memory compressed during the run | 0.2 GB | < 2 GB | ok |
| k6 process, peak | 1.59 cores, 6445 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,142,263 vs 1,142,263 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 762,974 vs 753,928 (+1.20%) | within 2% | ok |
| Writes stored (data check) | 321,952 posts stored for 321,791 acknowledged, 956,816 likes for 956,867 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 10 ms | 0.00% | 4% | pass |
| coarse 2 | 15 | 21 | 8 ms | 10 ms | 0.00% | 6% | pass |
| coarse 3 | 22 | 31 | 8 ms | 11 ms | 0.00% | 8% | pass |
| coarse 4 | 34 | 47 | 8 ms | 10 ms | 0.00% | 11% | pass |
| coarse 5 | 51 | 71 | 8 ms | 11 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 106 | 8 ms | 12 ms | 0.00% | 22% | pass |
| coarse 7 | 114 | 160 | 9 ms | 14 ms | 0.00% | 29% | pass |
| coarse 8 | 171 | 239 | 9 ms | 14 ms | 0.00% | 34% | pass |
| coarse 9 | 256 | 359 | 8 ms | 13 ms | 0.00% | 39% | pass |
| coarse 10 | 384 | 537 | 7 ms | 11 ms | 0.00% | 42% | pass |
| coarse 11 | 577 | 805 | 5 ms | 10 ms | 0.00% | 45% | pass |
| coarse 12 | 865 | 1212 | 4 ms | 8 ms | 0.00% | 47% | pass |
| coarse 13 | 1297 | 1814 | 3 ms | 5 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2723 | 3 ms | 5 ms | 0.00% | 58% | pass |
| coarse 15 | 2919 | 3157 | 1439 ms | 22783 ms | 1.48% | 93% | fail: p95 1439 ms, p99 22783 ms, errors 1.5%, k6 dropped 18.2% of sessions |
| fine 1 | 2141 | 2996 | 3 ms | 6 ms | 0.00% | 68% | pass |
| fine 2 | 2335 | 3272 | 3 ms | 7 ms | 0.00% | 73% | pass |
| fine 3 | 2530 | 3538 | 4 ms | 13 ms | 0.00% | 78% | pass |
| fine 4 | 2724 | 3817 | 6 ms | 69 ms | 0.00% | 81% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2688 | 31974 ms | 60001 ms | 5.40% |
| back at 1x | 2709 | 15254 ms | 60000 ms | 3.46% |

Did not recover within 2 minutes.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
