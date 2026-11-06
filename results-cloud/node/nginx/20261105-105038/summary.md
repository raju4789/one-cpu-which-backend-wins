# node / nginx

Run `node-nginx-20261105-105038`, 2026-11-05T10:50:38+00:00 to 2026-11-05T11:25:31+00:00

**Warning:** calibration 24.96 s is 355% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **287 req/s** | 205 | 824 | 3 ms | 65 ms | 187 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 33% | 151 MB |
| bench-cadvisor-1 | 1% | 22 MB |
| bench-nginx-1 | 12% | 34 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 17% | 540 MB |
| bench-postgres-exporter-1 | 1% | 10 MB |
| whole VM | 61% | 1029 MB |

The Mac running k6 peaked at 23% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 23% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.8 cores, 563 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 24.96 s (+354.6% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 92,559 vs 92,558 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 92,312 vs 92,312 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 21,824 posts stored for 21,786 acknowledged, 64,855 likes for 64,681 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 20 ms | 35 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 19 ms | 39 ms | 0.00% | 15% | pass |
| coarse 3 | 22 | 31 | 17 ms | 32 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 48 | 20 ms | 38 ms | 0.00% | 20% | pass |
| coarse 5 | 51 | 72 | 43 ms | 417 ms | 0.00% | 28% | pass |
| coarse 6 | 76 | 107 | 26 ms | 147 ms | 0.00% | 42% | pass |
| coarse 7 | 114 | 160 | 36 ms | 149 ms | 0.00% | 47% | pass |
| coarse 8 | 171 | 238 | 91 ms | 405 ms | 0.00% | 55% | pass |
| coarse 9 | 256 | 356 | 1168 ms | 3494 ms | 2.66% | 81% | fail: p95 1168 ms, p99 3494 ms, errors 2.7% |
| fine 1 | 188 | 264 | 35 ms | 99 ms | 0.00% | 56% | pass |
| fine 2 | 205 | 286 | 79 ms | 258 ms | 0.00% | 67% | pass |
| fine 3 | 222 | 311 | 989 ms | 3206 ms | 1.92% | 74% | fail: p95 989 ms, p99 3206 ms, errors 1.9% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 430 | 1163 ms | 3645 ms | 4.12% |
| back at 1x | 286 | 42 ms | 119 ms | 0.00% |

Recovered.

Idle baseline: the VM used 20% of the core with no load (monitoring agents and Postgres).
Calibration: 24.96 s.
