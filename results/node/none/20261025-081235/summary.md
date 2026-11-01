# node / none

Run `node-none-20261025-081235`, 2026-10-25T08:12:35+01:00 to 2026-10-25T08:30:31+01:00

**Aborted, not a valid result:** k6 could not open 322 connections while the server answered in p95 16 ms. That is the Mac or the VM network, not the stack. Most likely the Mac firewall's connection limit: check `sudo pfctl -s memory`, see Network in harness/README.md. Details: /Users/raju4789/Raju/projects/one-cpu-which-backend-wins/results/node/none/20261025-081235/k6-ramp-fine.log

## Result

No rate passed the 5-minute confirm.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 11 ms | 19 ms | 0.00% | 11% | pass |
| coarse 2 | 15 | 21 | 12 ms | 21 ms | 0.00% | 15% | pass |
| coarse 3 | 22 | 31 | 11 ms | 18 ms | 0.00% | 19% | pass |
| coarse 4 | 34 | 48 | 12 ms | 18 ms | 0.00% | 25% | pass |
| coarse 5 | 51 | 71 | 11 ms | 18 ms | 0.00% | 31% | pass |
| coarse 6 | 76 | 106 | 11 ms | 19 ms | 0.00% | 37% | pass |
| coarse 7 | 114 | 160 | 10 ms | 15 ms | 0.00% | 44% | pass |
| coarse 8 | 171 | 239 | 9 ms | 16 ms | 0.00% | 45% | pass |
| coarse 9 | 256 | 358 | 6 ms | 14 ms | 0.00% | 49% | pass |
| coarse 10 | 384 | 539 | 5 ms | 14 ms | 0.00% | 52% | pass |
| coarse 11 | 577 | 809 | 5 ms | 19 ms | 0.00% | 53% | pass |
| coarse 12 | 865 | 1209 | 14 ms | 29 ms | 0.00% | 66% | pass |
| coarse 13 | 1297 | 1595 | 4880 ms | 5124 ms | 21.84% | 96% | fail: p95 4880 ms, p99 5124 ms, errors 21.8%, k6 dropped 12.0% of sessions |
| fine 1 | 952 | 1333 | 16 ms | 34 ms | 0.01% | 72% | fail: invalid: k6 could not connect 322 times |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.74 s.
