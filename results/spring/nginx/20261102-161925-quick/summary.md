# spring / nginx (quick run, for tuning only)

Run `spring-nginx-20261102-161925`, 2026-11-02T16:19:25+01:00 to 2026-11-02T16:23:31+01:00

**Aborted, not a valid result:** k6 ran out of virtual users (--max-vus 10000), so it could not start every session: the load generator was the limit. Rerun with --max-vus 20000

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 1.24 cores, 3661 MB | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 22d0e4c43f, stack 22d0e4c43f | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 2500 | 3487 | 1 ms | 3 ms | 0.00% | 48% | fail: invalid: k6 ran out of virtual users (--max-vus 10000) |

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
