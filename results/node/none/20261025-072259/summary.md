# node / none

Run `node-none-20261025-072259`, 2026-10-25T07:22:59+01:00 to 2026-10-25T08:11:03+01:00

**Aborted, not a valid result:** KeyboardInterrupt

## Result

No rate passed the 5-minute confirm.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 13 | 12 ms | 18 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 20 | 14 ms | 20 ms | 0.00% | 16% | pass |
| coarse 3 | 22 | 31 | 15 ms | 22 ms | 0.00% | 21% | pass |
| coarse 4 | 34 | 48 | 14 ms | 20 ms | 0.00% | 28% | pass |
| coarse 5 | 51 | 70 | 12 ms | 18 ms | 0.00% | 32% | pass |
| coarse 6 | 76 | 105 | 10 ms | 18 ms | 0.00% | 37% | pass |
| coarse 7 | 114 | 158 | 10 ms | 18 ms | 0.00% | 42% | pass |
| coarse 8 | 171 | 239 | 8 ms | 16 ms | 0.00% | 47% | pass |
| coarse 9 | 256 | 359 | 7 ms | 14 ms | 0.00% | 48% | pass |
| coarse 10 | 384 | 535 | 5 ms | 16 ms | 0.00% | 50% | pass |
| coarse 11 | 577 | 805 | 5 ms | 16 ms | 0.00% | 52% | pass |
| coarse 12 | 865 | 1214 | 9 ms | 48 ms | 0.00% | 60% | pass |
| coarse 13 | 1297 | 1721 | 275 ms | 384 ms | 0.00% | 83% | fail: k6 dropped 5.1% of sessions |
| fine 1 | 952 | 1332 | 8 ms | 19 ms | 0.00% | 60% | pass |
| fine 2 | 1038 | 1454 | 12 ms | 21 ms | 0.00% | 72% | pass |
| fine 3 | 1124 | 0 | - ms | - ms | - | 44% | fail: no requests recorded |

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.71 s.
