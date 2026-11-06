# node / none (quick run, for tuning only)

Run `node-none-20261104-080601`, 2026-11-04T08:06:02+00:00 to 2026-11-04T08:25:44+00:00

**Warning:** calibration 20.85 s is 280% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **88 req/s** | 63 | 254 | 12 ms | 93 ms | 440 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 27% | 134 MB |
| bench-cadvisor-1 | 1% | 49 MB |
| bench-nginx-1 | 5% | 38 MB |
| bench-nginx-exporter-1 | 0% | 19 MB |
| bench-postgres-1 | 28% | 467 MB |
| bench-postgres-exporter-1 | 1% | 17 MB |
| whole VM | 58% | 1047 MB |

The Mac running k6 peaked at 13% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 13% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.4 cores, 206 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.85 s (+279.8% vs 5.49 s) | < +3% | **FAIL** |
| Writes stored (data check) | 2,343 posts stored for 2,343 acknowledged, 6,871 likes for 6,872 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 0a7a9604bf, stack 0a7a9604bf | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 40 | 55 | 30 ms | 60 ms | 0.00% | 39% | pass |
| coarse 2 | 43 | 58 | 62 ms | 253 ms | 0.00% | 43% | pass |
| coarse 3 | 47 | 65 | 263 ms | 485 ms | 0.00% | 50% | pass |
| coarse 4 | 50 | 70 | 55 ms | 284 ms | 0.00% | 48% | pass |
| coarse 5 | 54 | 76 | 273 ms | 556 ms | 0.00% | 50% | pass |
| coarse 6 | 59 | 83 | 51 ms | 187 ms | 0.00% | 49% | pass |
| coarse 7 | 63 | 88 | 93 ms | 440 ms | 0.00% | 58% | pass |

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 20.85 s.
