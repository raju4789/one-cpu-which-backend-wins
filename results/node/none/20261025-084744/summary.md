# node / none

Run `node-none-20261025-084744`, 2026-10-25T08:47:44+01:00 to 2026-10-25T09:07:11+01:00

**Aborted, not a valid result:** k6 could not open 1091 connections while the server answered in p95 23 ms. That is the Mac or the VM network, not the stack. Most likely the Mac firewall's connection limit: check `sudo pfctl -s memory`, see Network in harness/README.md. Details: /Users/raju4789/Raju/projects/one-cpu-which-backend-wins/results/node/none/20261025-084744/k6-ramp-fine.log

## Result

No rate passed the 5-minute confirm.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 15 ms | 23 ms | 0.00% | 13% | pass |
| coarse 2 | 15 | 21 | 16 ms | 24 ms | 0.00% | 19% | pass |
| coarse 3 | 22 | 31 | 16 ms | 23 ms | 0.00% | 22% | pass |
| coarse 4 | 34 | 48 | 14 ms | 21 ms | 0.00% | 30% | pass |
| coarse 5 | 51 | 71 | 14 ms | 22 ms | 0.00% | 36% | pass |
| coarse 6 | 76 | 107 | 11 ms | 16 ms | 0.00% | 41% | pass |
| coarse 7 | 114 | 159 | 10 ms | 16 ms | 0.00% | 44% | pass |
| coarse 8 | 171 | 242 | 7 ms | 14 ms | 0.00% | 48% | pass |
| coarse 9 | 256 | 358 | 6 ms | 15 ms | 0.00% | 53% | pass |
| coarse 10 | 384 | 537 | 6 ms | 16 ms | 0.00% | 56% | pass |
| coarse 11 | 577 | 807 | 5 ms | 17 ms | 0.00% | 57% | pass |
| coarse 12 | 865 | 1211 | 15 ms | 42 ms | 0.00% | 66% | pass |
| coarse 13 | 1297 | 1441 | 5154 ms | 5182 ms | 26.61% | 94% | fail: p95 5154 ms, p99 5182 ms, errors 26.6%, k6 dropped 18.7% of sessions |
| fine 1 | 952 | 1333 | 23 ms | 40 ms | 0.09% | 77% | fail: invalid: k6 could not connect 1091 times |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.86 s.
