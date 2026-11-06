# rails / nginx

Run `rails-nginx-20261104-204130`, 2026-11-04T20:41:30+00:00 to 2026-11-04T21:16:03+00:00

**Warning:** calibration 21.68 s is 295% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **224 req/s** | 160 | 642 | 2 ms | 29 ms | 61 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 24% | 98 MB |
| bench-cadvisor-1 | 1% | 46 MB |
| bench-nginx-1 | 10% | 36 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 13% | 438 MB |
| bench-postgres-exporter-1 | 1% | 13 MB |
| whole VM | 48% | 892 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.6 cores, 449 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.68 s (+294.9% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 72,316 vs 72,316 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 66,285 vs 66,284 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 16,727 posts stored for 16,724 acknowledged, 50,381 likes for 50,365 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 13 ms | 24 ms | 0.00% | 7% | pass |
| coarse 2 | 15 | 21 | 15 ms | 23 ms | 0.00% | 12% | pass |
| coarse 3 | 22 | 31 | 16 ms | 26 ms | 0.00% | 11% | pass |
| coarse 4 | 34 | 48 | 18 ms | 33 ms | 0.00% | 20% | pass |
| coarse 5 | 51 | 72 | 20 ms | 125 ms | 0.00% | 29% | pass |
| coarse 6 | 76 | 107 | 19 ms | 36 ms | 0.00% | 30% | pass |
| coarse 7 | 114 | 160 | 19 ms | 37 ms | 0.00% | 40% | pass |
| coarse 8 | 171 | 239 | 90 ms | 1031 ms | 0.00% | 56% | fail: p99 1031 ms |
| fine 1 | 125 | 176 | 20 ms | 38 ms | 0.00% | 39% | pass |
| fine 2 | 137 | 192 | 38 ms | 964 ms | 0.00% | 49% | pass |
| fine 3 | 148 | 208 | 20 ms | 57 ms | 0.00% | 46% | pass |
| fine 4 | 160 | 224 | 103 ms | 313 ms | 0.00% | 51% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 289 | 10726 ms | 15806 ms | 0.00% |
| back at 1x | 224 | 3524 ms | 5502 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 21.68 s.
