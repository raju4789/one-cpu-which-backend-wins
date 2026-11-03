# spring / none

Run `spring-none-20261103-105025`, 2026-11-03T10:50:25+01:00 to 2026-11-03T11:28:55+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **2359 req/s** | 1686 | 6755 | 1 ms | 46 ms | 81 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 19% | 513 MB |
| bench-cadvisor-1 | 0% | 30 MB |
| bench-nginx-1 | 8% | 54 MB |
| bench-nginx-exporter-1 | 0% | 12 MB |
| bench-postgres-1 | 55% | 568 MB |
| bench-postgres-exporter-1 | 0% | 9 MB |
| whole VM | 82% | 1576 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 1.03 cores, 3693 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.46 s (-0.5% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (confirm) | 760,557 vs 760,556 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 697,502 vs 697,502 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 153,823 posts stored for 153,803 acknowledged, 436,972 likes for 436,948 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 17b0155dd5, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 14 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 11 ms | 16 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 10 ms | 15 ms | 0.00% | 19% | pass |
| coarse 4 | 34 | 47 | 8 ms | 12 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 71 | 8 ms | 12 ms | 0.00% | 29% | pass |
| coarse 6 | 76 | 107 | 8 ms | 11 ms | 0.00% | 37% | pass |
| coarse 7 | 114 | 160 | 7 ms | 11 ms | 0.00% | 44% | pass |
| coarse 8 | 171 | 238 | 7 ms | 10 ms | 0.00% | 52% | pass |
| coarse 9 | 256 | 359 | 6 ms | 9 ms | 0.00% | 52% | pass |
| coarse 10 | 384 | 538 | 5 ms | 8 ms | 0.00% | 54% | pass |
| coarse 11 | 577 | 808 | 3 ms | 5 ms | 0.00% | 61% | pass |
| coarse 12 | 865 | 1212 | 2 ms | 4 ms | 0.00% | 58% | pass |
| coarse 13 | 1297 | 1817 | 2 ms | 8 ms | 0.00% | 64% | pass |
| coarse 14 | 1946 | 2529 | 413 ms | 860 ms | 36.78% | 99% | fail: p95 413 ms, errors 36.8% |
| fine 1 | 1427 | 2001 | 2 ms | 10 ms | 0.00% | 70% | pass |
| fine 2 | 1556 | 2175 | 3 ms | 24 ms | 0.00% | 71% | pass |
| fine 3 | 1686 | 2362 | 72 ms | 105 ms | 0.10% | 86% | pass |
| fine 4 | 1816 | 2451 | 212 ms | 258 ms | 18.16% | 86% | fail: errors 18.2% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 3004 | 302 ms | 344 ms | 55.54% |
| back at 1x | 2362 | 37 ms | 62 ms | 0.00% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.46 s.
