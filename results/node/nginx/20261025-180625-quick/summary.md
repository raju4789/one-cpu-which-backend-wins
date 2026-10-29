# node / nginx (quick run, for tuning only)

Run `node-nginx-20261025-180625`, 2026-10-25T18:06:25+01:00 to 2026-10-25T18:10:29+01:00

**Warning:** the Mac compressed 2.6 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on

## Result

No rate passed the 5-minute confirm.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 3200 | 4465 | 191 ms | 535 ms | 2.60% | 90% | fail: errors 2.6% |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.62 s.
