# spring / none (quick run, for tuning only)

Run `spring-none-20261104-061507`, 2026-11-04T06:15:07+00:00 to 2026-11-04T06:23:12+00:00

**Warning:** calibration 20.41 s is 272% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.8 cores, 561 MB | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 20.41 s (+271.8% vs 5.49 s) | < +3% | **FAIL** |
| Code fingerprint | harness 791cde771b, stack 17b0155dd5 (spring-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 150 | 195 | 12232 ms | 14706 ms | 20.55% | 98% | fail: p95 12232 ms, p99 14706 ms, errors 20.5% |

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 20.41 s.
