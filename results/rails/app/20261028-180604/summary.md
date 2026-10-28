# rails / app

Run `rails-app-20261028-180604`, 2026-10-28T18:06:04+01:00 to 2026-10-28T18:44:32+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2544 req/s** | 1816 | 7273 | 1 ms | 11 ms | 56 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 58% | 153 MB |
| bench-cadvisor-1 | 0% | 24 MB |
| bench-nginx-1 | 10% | 64 MB |
| bench-nginx-exporter-1 | 0% | 8 MB |
| bench-postgres-1 | 12% | 581 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 82% | 1260 MB |

The Mac running k6 peaked at 18% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 18% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.22 cores, 4608 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 820,223 vs 820,223 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 546,470 vs 541,220 (+0.97%) | within 2% | ok |
| Writes stored (data check) | 166,239 posts stored for 166,172 acknowledged, 489,314 likes for 489,201 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 8% | pass |
| coarse 3 | 22 | 30 | 8 ms | 10 ms | 0.00% | 11% | pass |
| coarse 4 | 34 | 48 | 8 ms | 11 ms | 0.00% | 16% | pass |
| coarse 5 | 51 | 70 | 9 ms | 12 ms | 0.00% | 20% | pass |
| coarse 6 | 76 | 106 | 9 ms | 13 ms | 0.00% | 29% | pass |
| coarse 7 | 114 | 159 | 9 ms | 13 ms | 0.00% | 39% | pass |
| coarse 8 | 171 | 239 | 8 ms | 12 ms | 0.00% | 45% | pass |
| coarse 9 | 256 | 358 | 7 ms | 10 ms | 0.00% | 47% | pass |
| coarse 10 | 384 | 537 | 6 ms | 10 ms | 0.00% | 45% | pass |
| coarse 11 | 577 | 808 | 4 ms | 7 ms | 0.00% | 50% | pass |
| coarse 12 | 865 | 1211 | 3 ms | 5 ms | 0.00% | 49% | pass |
| coarse 13 | 1297 | 1817 | 2 ms | 5 ms | 0.00% | 59% | pass |
| coarse 14 | 1946 | 2201 | 1770 ms | 26922 ms | 0.00% | 91% | fail: p95 1770 ms, p99 26922 ms, k6 dropped 7.2% of sessions |
| fine 1 | 1427 | 2000 | 2 ms | 6 ms | 0.00% | 58% | pass |
| fine 2 | 1556 | 2178 | 4 ms | 20 ms | 0.00% | 68% | pass |
| fine 3 | 1686 | 2368 | 4 ms | 16 ms | 0.00% | 73% | pass |
| fine 4 | 1816 | 2547 | 10 ms | 49 ms | 0.00% | 85% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1868 | 60001 ms | 60001 ms | 9.36% |
| back at 1x | 2032 | 42607 ms | 60001 ms | 5.07% |

Did not recover within 2 minutes.

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
