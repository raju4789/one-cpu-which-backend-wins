# rails / nginx

Run `rails-nginx-20261105-130034`, 2026-11-05T13:00:34+00:00 to 2026-11-05T13:42:34+00:00

**Warning:** calibration 23.11 s is 321% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **239 req/s** | 171 | 687 | 2 ms | 29 ms | 65 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 25% | 125 MB |
| bench-cadvisor-1 | 1% | 22 MB |
| bench-nginx-1 | 10% | 33 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 13% | 445 MB |
| bench-postgres-exporter-1 | 1% | 9 MB |
| whole VM | 50% | 909 MB |

The Mac running k6 peaked at 21% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 21% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.8 cores, 475 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 23.11 s (+320.9% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 77,011 vs 77,010 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 66,854 vs 66,641 (+0.32%) | within 2% | ok |
| Writes stored (data check) | 22,699 posts stored for 22,685 acknowledged, 68,460 likes for 68,408 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 16 ms | 34 ms | 0.00% | 7% | pass |
| coarse 2 | 15 | 21 | 20 ms | 35 ms | 0.00% | 13% | pass |
| coarse 3 | 22 | 31 | 16 ms | 29 ms | 0.00% | 14% | pass |
| coarse 4 | 34 | 47 | 21 ms | 39 ms | 0.00% | 26% | pass |
| coarse 5 | 51 | 71 | 29 ms | 63 ms | 0.00% | 26% | pass |
| coarse 6 | 76 | 107 | 34 ms | 91 ms | 0.00% | 36% | pass |
| coarse 7 | 114 | 160 | 66 ms | 433 ms | 0.00% | 48% | pass |
| coarse 8 | 171 | 240 | 171 ms | 867 ms | 0.00% | 64% | pass |
| coarse 9 | 256 | 278 | 18261 ms | 22125 ms | 3.57% | 83% | fail: p95 18261 ms, p99 22125 ms, errors 3.6% |
| fine 1 | 188 | 262 | 57 ms | 179 ms | 0.00% | 57% | pass |
| fine 2 | 205 | 286 | 604 ms | 1999 ms | 0.00% | 70% | fail: p95 604 ms, p99 1999 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 289 | 14196 ms | 29201 ms | 0.00% |
| back at 1x | 223 | 11974 ms | 25064 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 23.11 s.
