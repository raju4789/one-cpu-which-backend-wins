# spring / none

Run `spring-none-20261101-205337`, 2026-11-01T20:53:37+01:00 to 2026-11-01T20:57:39+01:00

**Aborted, not a valid result:** KeyboardInterrupt

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | - | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.49 s (+0.0% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness dfc3f37fda, stack dfc3f37fda | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.49 s.
