# node / none

Run `node-none-20261104-161057`, 2026-11-04T16:10:57+00:00 to 2026-11-04T16:45:02+00:00

**Warning:** calibration 21.56 s is 293% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **78 req/s** | 56 | 225 | 9 ms | 29 ms | 60 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 20% | 132 MB |
| bench-cadvisor-1 | 0% | 48 MB |
| bench-nginx-1 | 3% | 38 MB |
| bench-nginx-exporter-1 | 0% | 19 MB |
| bench-postgres-1 | 23% | 510 MB |
| bench-postgres-exporter-1 | 1% | 19 MB |
| whole VM | 49% | 987 MB |

The Mac running k6 peaked at 12% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 12% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 182 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.56 s (+292.7% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 25,242 vs 25,242 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 25,255 vs 25,254 (+0.01%) | within 2% | ok |
| Writes stored (data check) | 5,926 posts stored for 5,918 acknowledged, 17,869 likes for 17,829 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 43614a0612 (node-untuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 21 ms | 43 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 24 ms | 48 ms | 0.00% | 25% | pass |
| coarse 3 | 22 | 31 | 20 ms | 34 ms | 0.00% | 24% | pass |
| coarse 4 | 34 | 47 | 22 ms | 40 ms | 0.00% | 34% | pass |
| coarse 5 | 51 | 70 | 26 ms | 52 ms | 0.00% | 40% | pass |
| coarse 6 | 76 | 106 | 1308 ms | 1675 ms | 0.00% | 73% | fail: p95 1308 ms, p99 1675 ms |
| fine 1 | 56 | 78 | 28 ms | 56 ms | 0.00% | 49% | pass |
| fine 2 | 61 | 86 | 884 ms | 1268 ms | 0.00% | 58% | fail: p95 884 ms, p99 1268 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 117 | 51 ms | 107 ms | 0.00% |
| back at 1x | 79 | 28 ms | 63 ms | 0.00% |

Recovered.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 21.56 s.
