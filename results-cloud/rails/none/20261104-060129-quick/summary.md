# rails / none (quick run, for tuning only)

Run `rails-none-20261104-060129`, 2026-11-04T06:01:29+00:00 to 2026-11-04T06:13:07+00:00

**Warning:** calibration 22.04 s is 301% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

No rate passed the 5-minute confirm.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | - | < 70% | - |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.8 cores, 550 MB | for reference | - |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 22.04 s (+301.5% vs 5.49 s) | < +3% | **FAIL** |
| Code fingerprint | harness 791cde771b, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 150 | 96 | 10204 ms | 10340 ms | 0.00% | 92% | fail: p95 10204 ms, p99 10340 ms, k6 dropped 55.2% of sessions |

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 22.04 s.
