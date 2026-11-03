# spring / app (quick run, for tuning only)

Run `spring-app-20261102-130326`, 2026-11-02T13:03:26+01:00 to 2026-11-02T13:07:37+01:00

**Aborted, not a valid result:** k6 ran out of virtual users (--max-vus 10000), so it could not start every session: the load generator was the limit. Rerun with --max-vus 20000

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.18 cores, 3656 MB | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.60 s (+2.0% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 22d0e4c43f, stack 22d0e4c43f | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 2500 | 3477 | 1 ms | 3 ms | 0.00% | 55% | fail: invalid: k6 ran out of virtual users (--max-vus 10000) |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.6 s.
