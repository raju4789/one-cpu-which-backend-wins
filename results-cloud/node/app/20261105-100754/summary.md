# node / app

Run `node-app-20261105-100754`, 2026-11-05T10:07:54+00:00 to 2026-11-05T10:40:38+00:00

**Warning:** calibration 23.20 s is 323% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **175 req/s** | 125 | 503 | 5 ms | 38 ms | 82 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 29% | 128 MB |
| bench-cadvisor-1 | 1% | 23 MB |
| bench-nginx-1 | 8% | 33 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 11% | 451 MB |
| bench-postgres-exporter-1 | 1% | 11 MB |
| whole VM | 45% | 915 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.6 cores, 359 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 23.20 s (+322.6% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 56,409 vs 56,409 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 56,456 vs 56,455 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 13,093 posts stored for 13,064 acknowledged, 39,581 likes for 39,435 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 20 ms | 32 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 18 ms | 32 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 30 | 47 ms | 245 ms | 0.00% | 22% | pass |
| coarse 4 | 34 | 48 | 21 ms | 39 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 70 | 31 ms | 148 ms | 0.00% | 30% | pass |
| coarse 6 | 76 | 108 | 30 ms | 86 ms | 0.00% | 34% | pass |
| coarse 7 | 114 | 159 | 41 ms | 118 ms | 0.00% | 49% | pass |
| coarse 8 | 171 | 239 | 130 ms | 1657 ms | 0.00% | 66% | fail: p99 1657 ms |
| fine 1 | 125 | 174 | 29 ms | 73 ms | 0.00% | 48% | pass |
| fine 2 | 137 | 192 | 95 ms | 1089 ms | 0.00% | 52% | fail: p99 1089 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 263 | 51 ms | 133 ms | 0.00% |
| back at 1x | 175 | 29 ms | 60 ms | 0.00% |

Recovered.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 23.2 s.
