# rails / none (quick run, for tuning only)

Run `rails-none-20261027-203227`, 2026-10-27T20:32:27+01:00 to 2026-10-27T20:47:29+01:00

**Warning:** calibration 5.69 s is 4% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1141 req/s** | 814 | 3265 | 1 ms | 38 ms | 80 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 48% | 113 MB |
| bench-cadvisor-1 | 0% | 32 MB |
| bench-nginx-1 | 4% | 49 MB |
| bench-nginx-exporter-1 | 0% | 14 MB |
| bench-postgres-1 | 27% | 527 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 86% | 1173 MB |

The Mac running k6 peaked at 21% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 21% | < 70% | ok |
| Mac memory compressed during the run | 0.1 GB | < 2 GB | ok |
| k6 process, peak | 0.88 cores, 2610 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.69 s (+3.6% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (overload) | 261,083 vs 258,870 (+0.86%) | within 2% | ok |
| Writes stored (data check) | 41,133 posts stored for 41,119 acknowledged, 119,992 likes for 119,964 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 6610e6577b, stack 6610e6577b | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 646 | 904 | 3 ms | 7 ms | 0.00% | 60% | pass |
| coarse 2 | 698 | 976 | 4 ms | 23 ms | 0.00% | 70% | pass |
| coarse 3 | 753 | 1056 | 5 ms | 24 ms | 0.00% | 76% | pass |
| coarse 4 | 814 | 1141 | 38 ms | 80 ms | 0.00% | 86% | pass |
| coarse 5 | 879 | 1090 | 1372 ms | 18378 ms | 0.94% | 97% | fail: p95 1372 ms, p99 18378 ms, k6 dropped 5.2% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 963 | 59994 ms | 60000 ms | 8.02% |
| back at 1x | 938 | 36440 ms | 60000 ms | 5.94% |

Did not recover within 2 minutes.

Idle baseline: the VM used 10% of the core with no load (monitoring agents and Postgres).
Calibration: 5.69 s.
