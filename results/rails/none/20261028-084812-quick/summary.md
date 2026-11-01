# rails / none (quick run, for tuning only)

Run `rails-none-20261028-084812`, 2026-10-28T08:48:12+01:00 to 2026-10-28T09:01:19+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **976 req/s** | 698 | 2795 | 1 ms | 7 ms | 67 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 44% | 208 MB |
| bench-cadvisor-1 | 0% | 28 MB |
| bench-nginx-1 | 4% | 48 MB |
| bench-nginx-exporter-1 | 0% | 10 MB |
| bench-postgres-1 | 24% | 447 MB |
| bench-postgres-exporter-1 | 0% | 12 MB |
| whole VM | 73% | 1240 MB |

The Mac running k6 peaked at 17% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 17% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.78 cores, 2560 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.54 s (+0.9% vs 5.49 s) | < +3% | ok |
| Nginx vs k6 request count (overload) | 263,984 vs 263,984 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 32,452 posts stored for 32,443 acknowledged, 95,693 likes for 95,666 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 7d50006444, stack 7d50006444 | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 905 | 4 ms | 16 ms | 0.00% | 62% | pass |
| coarse 2 | 698 | 976 | 7 ms | 67 ms | 0.00% | 73% | pass |
| coarse 3 | 753 | 988 | 2924 ms | 4282 ms | 0.00% | 86% | fail: p95 2924 ms, p99 4282 ms |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1017 | 17136 ms | 60000 ms | 4.50% |
| back at 1x | 974 | 2182 ms | 24391 ms | 0.39% |

Did not recover within 2 minutes.

Idle baseline: the VM used 7% of the core with no load (monitoring agents and Postgres).
Calibration: 5.54 s.
