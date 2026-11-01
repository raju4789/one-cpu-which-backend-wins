# node / nginx (quick run, for tuning only)

Run `node-nginx-20261026-084548`, 2026-10-26T08:45:48+01:00 to 2026-10-26T09:02:48+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4929 req/s** | 3526 | 14172 | 0 ms | 48 ms | 224 ms | 0.55% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 45% | 153 MB |
| bench-cadvisor-1 | 0% | 20 MB |
| bench-nginx-1 | 18% | 78 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 23% | 503 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 89% | 1155 MB |

The Mac running k6 peaked at 25% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 25% | < 70% | ok |
| Mac memory compressed during the run | -0.0 GB | < 2 GB | ok |
| k6 process, peak | 2.3 cores, 7483 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.58 s (+1.6% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 1,501,592 vs 1,501,592 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 209,550 posts stored for 209,550 acknowledged, 607,499 likes for 608,021 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness f36ae79b65, stack f36ae79b65 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 2400 | 3362 | 3 ms | 13 ms | 0.00% | 63% | pass |
| coarse 2 | 2592 | 3628 | 3 ms | 13 ms | 0.00% | 66% | pass |
| coarse 3 | 2799 | 3924 | 4 ms | 18 ms | 0.00% | 70% | pass |
| coarse 4 | 3023 | 4225 | 5 ms | 23 ms | 0.00% | 77% | pass |
| coarse 5 | 3265 | 4564 | 10 ms | 73 ms | 0.00% | 77% | pass |
| coarse 6 | 3526 | 4929 | 48 ms | 224 ms | 0.55% | 89% | pass |
| coarse 7 | 3808 | 5254 | 252 ms | 317 ms | 10.16% | 99% | fail: errors 10.2% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 6634 | 350 ms | 446 ms | 25.23% |
| back at 1x | 4937 | 23 ms | 133 ms | 0.18% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.58 s.
