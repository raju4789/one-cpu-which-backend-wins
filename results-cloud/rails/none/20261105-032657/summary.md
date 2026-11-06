# rails / none

Run `rails-none-20261105-032657`, 2026-11-05T03:26:57+00:00 to 2026-11-05T03:58:24+00:00

**Warning:** calibration 20.87 s is 280% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **86 req/s** | 61 | 246 | 11 ms | 40 ms | 77 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 36% | 145 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 4% | 31 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 25% | 430 MB |
| bench-postgres-exporter-1 | 1% | 7 MB |
| whole VM | 65% | 906 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 194 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.87 s (+280.1% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 27,627 vs 27,626 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 27,590 vs 27,589 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 6,525 posts stored for 6,525 acknowledged, 20,061 likes for 20,063 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 18 ms | 26 ms | 0.00% | 14% | pass |
| coarse 2 | 15 | 21 | 21 ms | 34 ms | 0.00% | 23% | pass |
| coarse 3 | 22 | 31 | 22 ms | 42 ms | 0.00% | 30% | pass |
| coarse 4 | 34 | 47 | 40 ms | 119 ms | 0.00% | 45% | pass |
| coarse 5 | 51 | 72 | 57 ms | 379 ms | 0.00% | 64% | pass |
| coarse 6 | 76 | 106 | 566 ms | 906 ms | 0.00% | 88% | fail: p95 566 ms |
| fine 1 | 56 | 78 | 33 ms | 61 ms | 0.00% | 60% | pass |
| fine 2 | 61 | 85 | 91 ms | 419 ms | 0.00% | 66% | pass |
| fine 3 | 66 | 92 | 1305 ms | 1521 ms | 0.00% | 73% | fail: p95 1305 ms, p99 1521 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 129 | 1163 ms | 1393 ms | 0.00% |
| back at 1x | 85 | 133 ms | 779 ms | 0.00% |

Recovered.

Idle baseline: the VM used 21% of the core with no load (monitoring agents and Postgres).
Calibration: 20.87 s.
