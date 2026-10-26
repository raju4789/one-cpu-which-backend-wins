# node / none

Run `node-none-20261026-135322`, 2026-10-26T13:53:22+01:00 to 2026-10-26T14:37:56+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1817 req/s** | 1297 | 5202 | 1 ms | 54 ms | 141 ms | 0.03% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 32% | 185 MB |
| bench-cadvisor-1 | 0% | 24 MB |
| bench-nginx-1 | 6% | 53 MB |
| bench-nginx-exporter-1 | 0% | 13 MB |
| bench-postgres-1 | 42% | 627 MB |
| bench-postgres-exporter-1 | 0% | 10 MB |
| whole VM | 82% | 1253 MB |

The Mac running k6 peaked at 26% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 26% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.9 cores, 3335 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.44 s (-0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 585,758 vs 585,758 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 560,716 vs 560,716 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 161,969 posts stored for 161,926 acknowledged, 458,527 likes for 458,471 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7a3f606049, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 12 ms | 0.00% | 8% | pass |
| coarse 2 | 15 | 21 | 8 ms | 14 ms | 0.00% | 11% | pass |
| coarse 3 | 22 | 32 | 9 ms | 15 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 48 | 9 ms | 14 ms | 0.00% | 21% | pass |
| coarse 5 | 51 | 71 | 9 ms | 15 ms | 0.00% | 26% | pass |
| coarse 6 | 76 | 107 | 9 ms | 17 ms | 0.00% | 38% | pass |
| coarse 7 | 114 | 161 | 10 ms | 18 ms | 0.00% | 46% | pass |
| coarse 8 | 171 | 240 | 8 ms | 14 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 359 | 7 ms | 13 ms | 0.00% | 51% | pass |
| coarse 10 | 384 | 541 | 5 ms | 16 ms | 0.00% | 54% | pass |
| coarse 11 | 577 | 807 | 4 ms | 15 ms | 0.00% | 49% | pass |
| coarse 12 | 865 | 1210 | 3 ms | 14 ms | 0.00% | 54% | pass |
| coarse 13 | 1297 | 1819 | 20 ms | 32 ms | 0.00% | 78% | pass |
| coarse 14 | 1946 | 2519 | 236 ms | 265 ms | 40.01% | 96% | fail: errors 40.0% |
| fine 1 | 1427 | 1998 | 148 ms | 168 ms | 0.31% | 83% | pass |
| fine 2 | 1556 | 2123 | 196 ms | 224 ms | 13.36% | 88% | fail: errors 13.4% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2516 | 230 ms | 254 ms | 40.24% |
| back at 1x | 1815 | 17 ms | 48 ms | 0.00% |

Recovered.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 5.44 s.
