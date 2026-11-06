# node / none (quick run, for tuning only)

Run `node-none-20261104-072328`, 2026-11-04T07:23:28+00:00 to 2026-11-04T07:35:56+00:00

**Warning:** calibration 22.46 s is 309% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **65 req/s** | 47 | 189 | 9 ms | 32 ms | 95 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 22% | 192 MB |
| bench-cadvisor-1 | 0% | 36 MB |
| bench-nginx-1 | 3% | 38 MB |
| bench-nginx-exporter-1 | 0% | 19 MB |
| bench-postgres-1 | 20% | 445 MB |
| bench-postgres-exporter-1 | 1% | 14 MB |
| whole VM | 47% | 1038 MB |

The Mac running k6 peaked at 11% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 11% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 201 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 22.46 s (+309.1% vs 5.49 s) | < +3% | **FAIL** |
| Writes stored (data check) | 1,374 posts stored for 1,374 acknowledged, 4,010 likes for 4,010 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 791cde771b, stack 791cde771b | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 40 | 57 | 33 ms | 73 ms | 0.00% | 42% | pass |
| coarse 2 | 43 | 61 | 72 ms | 158 ms | 0.00% | 48% | pass |
| coarse 3 | 47 | 65 | 32 ms | 95 ms | 0.00% | 47% | pass |
| coarse 4 | 50 | 70 | 1568 ms | 2142 ms | 5.73% | 47% | fail: p95 1568 ms, p99 2142 ms, errors 5.7% |

Idle baseline: the VM used 8% of the core with no load (monitoring agents and Postgres).
Calibration: 22.46 s.
