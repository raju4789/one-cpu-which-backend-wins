# rails / nginx

Run `rails-nginx-20261031-222800`, 2026-10-31T22:28:00+01:00 to 2026-10-31T23:15:35+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **3546 req/s** | 2530 | 10126 | 0 ms | 4 ms | 20 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 41% | 126 MB |
| bench-cadvisor-1 | 0% | 34 MB |
| bench-nginx-1 | 13% | 71 MB |
| bench-nginx-exporter-1 | 0% | 10 MB |
| bench-postgres-1 | 18% | 647 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 77% | 1331 MB |

The Mac running k6 peaked at 19% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 19% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.68 cores, 6471 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,142,764 vs 1,142,764 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 672,753 vs 668,136 (+0.69%) | within 2% | ok |
| Writes stored (data check) | 318,322 posts stored for 318,258 acknowledged, 948,179 likes for 948,712 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 82ea35c4d5, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 5% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 6% | pass |
| coarse 3 | 22 | 31 | 8 ms | 10 ms | 0.00% | 8% | pass |
| coarse 4 | 34 | 47 | 8 ms | 10 ms | 0.00% | 11% | pass |
| coarse 5 | 51 | 72 | 8 ms | 11 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 107 | 8 ms | 12 ms | 0.00% | 21% | pass |
| coarse 7 | 114 | 158 | 9 ms | 14 ms | 0.00% | 28% | pass |
| coarse 8 | 171 | 238 | 9 ms | 14 ms | 0.00% | 38% | pass |
| coarse 9 | 256 | 358 | 8 ms | 13 ms | 0.00% | 39% | pass |
| coarse 10 | 384 | 538 | 7 ms | 11 ms | 0.00% | 43% | pass |
| coarse 11 | 577 | 805 | 6 ms | 10 ms | 0.00% | 45% | pass |
| coarse 12 | 865 | 1211 | 4 ms | 7 ms | 0.00% | 44% | pass |
| coarse 13 | 1297 | 1819 | 3 ms | 5 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2720 | 3 ms | 5 ms | 0.00% | 58% | pass |
| coarse 15 | 2919 | 3085 | 3515 ms | 25745 ms | 1.55% | 95% | fail: p95 3515 ms, p99 25745 ms, errors 1.6%, k6 dropped 18.4% of sessions |
| fine 1 | 2141 | 2999 | 3 ms | 7 ms | 0.00% | 60% | pass |
| fine 2 | 2335 | 3270 | 4 ms | 15 ms | 0.00% | 68% | pass |
| fine 3 | 2530 | 3540 | 4 ms | 22 ms | 0.00% | 78% | pass |
| fine 4 | 2724 | 3812 | 6 ms | 45 ms | 0.00% | 81% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2282 | 59999 ms | 60000 ms | 7.13% |
| back at 1x | 2431 | 19604 ms | 60014 ms | 5.27% |

Did not recover within 2 minutes.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
