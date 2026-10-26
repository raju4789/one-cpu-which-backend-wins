# node / app

Run `node-app-20261026-144756`, 2026-10-26T14:47:56+01:00 to 2026-10-26T15:27:34+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4906 req/s** | 3503 | 14060 | 2 ms | 64 ms | 180 ms | 0.05% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 50% | 179 MB |
| bench-cadvisor-1 | 0% | 32 MB |
| bench-nginx-1 | 17% | 84 MB |
| bench-nginx-exporter-1 | 0% | 12 MB |
| bench-postgres-1 | 21% | 649 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 91% | 1271 MB |

The Mac running k6 peaked at 23% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 23% | < 70% | ok |
| Mac memory compressed during the run | 0.1 GB | < 2 GB | ok |
| k6 process, peak | 2.02 cores, 7333 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 1,581,319 vs 1,581,319 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 1,236,513 vs 1,236,514 (-0.00%) | within 2% | ok |
| Writes stored (data check) | 323,083 posts stored for 322,840 acknowledged, 964,595 likes for 964,136 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 7 ms | 10 ms | 0.00% | 6% | pass |
| coarse 2 | 15 | 22 | 7 ms | 12 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 7 ms | 12 ms | 0.00% | 10% | pass |
| coarse 4 | 34 | 48 | 7 ms | 12 ms | 0.00% | 13% | pass |
| coarse 5 | 51 | 72 | 7 ms | 11 ms | 0.00% | 17% | pass |
| coarse 6 | 76 | 107 | 8 ms | 12 ms | 0.00% | 23% | pass |
| coarse 7 | 114 | 161 | 8 ms | 14 ms | 0.00% | 29% | pass |
| coarse 8 | 171 | 240 | 9 ms | 15 ms | 0.00% | 40% | pass |
| coarse 9 | 256 | 360 | 7 ms | 13 ms | 0.00% | 44% | pass |
| coarse 10 | 384 | 535 | 7 ms | 12 ms | 0.00% | 41% | pass |
| coarse 11 | 577 | 807 | 6 ms | 10 ms | 0.00% | 46% | pass |
| coarse 12 | 865 | 1212 | 5 ms | 10 ms | 0.00% | 46% | pass |
| coarse 13 | 1297 | 1815 | 3 ms | 8 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2722 | 3 ms | 8 ms | 0.00% | 49% | pass |
| coarse 15 | 2919 | 4085 | 7 ms | 25 ms | 0.00% | 77% | pass |
| coarse 16 | 4379 | 5386 | 2173 ms | 8625 ms | 6.54% | 95% | fail: p95 2173 ms, p99 8625 ms, errors 6.5%, k6 dropped 10.8% of sessions |
| fine 1 | 3211 | 4497 | 14 ms | 74 ms | 0.00% | 82% | pass |
| fine 2 | 3503 | 4892 | 25 ms | 115 ms | 0.00% | 85% | pass |
| fine 3 | 3795 | 5307 | 440 ms | 802 ms | 5.37% | 97% | fail: p95 440 ms, errors 5.4% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 4321 | 10300 ms | 23991 ms | 7.39% |
| back at 1x | 4906 | 394 ms | 1970 ms | 2.55% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
