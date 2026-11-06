# node / none (quick run, for tuning only)

Run `node-none-20261104-054709`, 2026-11-04T05:47:10+00:00 to 2026-11-04T05:59:29+00:00

**Aborted, not a valid result:** k6 ran out of virtual users (--max-vus 10000), so it could not start every session: the load generator was the limit. Rerun with --max-vus 20000

**Warning:** calibration 18.87 s is 244% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

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
| Core speed (calibration) | 18.87 s (+243.7% vs 5.49 s) | < +3% | **FAIL** |
| Code fingerprint | harness 791cde771b, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 18.87 s.
