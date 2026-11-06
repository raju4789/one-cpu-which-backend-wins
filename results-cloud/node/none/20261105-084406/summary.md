# node / none

Run `node-none-20261105-084406`, 2026-11-05T08:44:06+00:00 to 2026-11-05T09:15:38+00:00

**Warning:** calibration 21.82 s is 297% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **117 req/s** | 84 | 340 | 10 ms | 89 ms | 492 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 26% | 237 MB |
| bench-cadvisor-1 | 0% | 48 MB |
| bench-nginx-1 | 5% | 36 MB |
| bench-nginx-exporter-1 | 0% | 16 MB |
| bench-postgres-1 | 34% | 462 MB |
| bench-postgres-exporter-1 | 0% | 17 MB |
| whole VM | 68% | 1096 MB |

The Mac running k6 peaked at 12% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 12% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 254 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.82 s (+297.4% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 37,848 vs 37,848 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 37,674 vs 37,673 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 8,771 posts stored for 8,712 acknowledged, 22,698 likes for 22,657 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 43614a0612 (node-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 19 ms | 31 ms | 0.00% | 20% | pass |
| coarse 2 | 15 | 21 | 30 ms | 54 ms | 0.00% | 26% | pass |
| coarse 3 | 22 | 31 | 18 ms | 30 ms | 0.00% | 26% | pass |
| coarse 4 | 34 | 47 | 79 ms | 195 ms | 0.00% | 42% | pass |
| coarse 5 | 51 | 72 | 41 ms | 180 ms | 0.00% | 53% | pass |
| coarse 6 | 76 | 105 | 122 ms | 455 ms | 0.00% | 68% | pass |
| coarse 7 | 114 | 159 | 3645 ms | 3918 ms | 21.03% | 95% | fail: p95 3645 ms, p99 3918 ms, errors 21.0% |
| fine 1 | 84 | 117 | 53 ms | 129 ms | 0.00% | 70% | pass |
| fine 2 | 91 | 128 | 468 ms | 634 ms | 0.00% | 80% | fail: p95 468 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 174 | 2631 ms | 2917 ms | 8.88% |
| back at 1x | 118 | 56 ms | 108 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 21.82 s.
