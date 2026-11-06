# rails / nginx

Run `rails-nginx-20261105-050003`, 2026-11-05T05:00:03+00:00 to 2026-11-05T05:33:44+00:00

**Warning:** calibration 21.39 s is 290% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **263 req/s** | 188 | 756 | 2 ms | 26 ms | 61 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 27% | 108 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 10% | 33 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 14% | 443 MB |
| bench-postgres-exporter-1 | 1% | 7 MB |
| whole VM | 52% | 888 MB |

The Mac running k6 peaked at 19% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 19% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.6 cores, 512 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.39 s (+289.6% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 84,692 vs 84,692 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 73,234 vs 73,233 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 17,950 posts stored for 17,950 acknowledged, 55,230 likes for 55,233 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 13 ms | 20 ms | 0.00% | 7% | pass |
| coarse 2 | 15 | 21 | 14 ms | 22 ms | 0.00% | 11% | pass |
| coarse 3 | 22 | 31 | 13 ms | 21 ms | 0.00% | 13% | pass |
| coarse 4 | 34 | 48 | 13 ms | 27 ms | 0.00% | 17% | pass |
| coarse 5 | 51 | 72 | 14 ms | 27 ms | 0.00% | 21% | pass |
| coarse 6 | 76 | 107 | 19 ms | 50 ms | 0.00% | 32% | pass |
| coarse 7 | 114 | 158 | 18 ms | 43 ms | 0.00% | 37% | pass |
| coarse 8 | 171 | 238 | 35 ms | 746 ms | 0.00% | 61% | pass |
| coarse 9 | 256 | 336 | 10160 ms | 13056 ms | 0.00% | 94% | fail: p95 10160 ms, p99 13056 ms |
| fine 1 | 188 | 264 | 24 ms | 59 ms | 0.00% | 49% | pass |
| fine 2 | 205 | 286 | 2747 ms | 4091 ms | 0.00% | 74% | fail: p95 2747 ms, p99 4091 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 296 | 15794 ms | 34662 ms | 0.00% |
| back at 1x | 262 | 2931 ms | 5213 ms | 0.00% |

Did not recover within 2 minutes.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 21.39 s.
