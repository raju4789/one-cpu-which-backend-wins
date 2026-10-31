# rails / nginx

Run `rails-nginx-20261031-203248`, 2026-10-31T20:32:48+01:00 to 2026-10-31T21:20:24+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **3540 req/s** | 2530 | 10130 | 0 ms | 4 ms | 38 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 41% | 130 MB |
| bench-cadvisor-1 | 0% | 27 MB |
| bench-nginx-1 | 13% | 68 MB |
| bench-nginx-exporter-1 | 0% | 10 MB |
| bench-postgres-1 | 17% | 618 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 77% | 1305 MB |

The Mac running k6 peaked at 25% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 25% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.52 cores, 6445 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.53 s (+0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,141,545 vs 1,141,545 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 729,298 vs 721,536 (+1.08%) | within 2% | ok |
| Writes stored (data check) | 302,677 posts stored for 302,461 acknowledged, 896,073 likes for 895,887 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 82ea35c4d5, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 9 ms | 11 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 9 ms | 12 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 48 | 8 ms | 10 ms | 0.00% | 11% | pass |
| coarse 5 | 51 | 71 | 7 ms | 10 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 105 | 8 ms | 12 ms | 0.00% | 20% | pass |
| coarse 7 | 114 | 158 | 9 ms | 13 ms | 0.00% | 27% | pass |
| coarse 8 | 171 | 238 | 9 ms | 15 ms | 0.00% | 38% | pass |
| coarse 9 | 256 | 358 | 8 ms | 13 ms | 0.00% | 42% | pass |
| coarse 10 | 384 | 537 | 7 ms | 11 ms | 0.00% | 42% | pass |
| coarse 11 | 577 | 806 | 5 ms | 10 ms | 0.00% | 45% | pass |
| coarse 12 | 865 | 1214 | 4 ms | 7 ms | 0.00% | 47% | pass |
| coarse 13 | 1297 | 1817 | 3 ms | 5 ms | 0.00% | 42% | pass |
| coarse 14 | 1946 | 2726 | 3 ms | 5 ms | 0.00% | 54% | pass |
| coarse 15 | 2919 | 3231 | 1547 ms | 22065 ms | 0.95% | 94% | fail: p95 1547 ms, p99 22065 ms, k6 dropped 15.5% of sessions |
| fine 1 | 2141 | 2990 | 3 ms | 5 ms | 0.00% | 67% | pass |
| fine 2 | 2335 | 3270 | 4 ms | 12 ms | 0.00% | 67% | pass |
| fine 3 | 2530 | 3532 | 4 ms | 11 ms | 0.00% | 77% | pass |
| fine 4 | 2724 | 3810 | 6 ms | 44 ms | 0.00% | 80% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2579 | 34749 ms | 60001 ms | 5.73% |
| back at 1x | 2534 | 15625 ms | 60001 ms | 3.58% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.53 s.
