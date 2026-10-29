# rails / nginx

Run `rails-nginx-20261028-234222`, 2026-10-28T23:42:22+01:00 to 2026-10-29T00:14:38+01:00

**Aborted, not a valid result:** k6 could not open 241 connections while the server answered in p95 6 ms. That is the Mac or the VM network, not the stack. Most likely the Mac firewall's connection limit: check `sudo pfctl -s memory`, see Network in harness/README.md. Details: /Users/raju4789/Raju/projects/one-cpu-which-backend-wins/results/rails/nginx/20261028-234222/k6-confirm-2724.log

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
| Core speed (calibration) | 5.45 s (-0.7% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 5% | pass |
| coarse 2 | 15 | 21 | 8 ms | 10 ms | 0.00% | 6% | pass |
| coarse 3 | 22 | 31 | 8 ms | 10 ms | 0.00% | 8% | pass |
| coarse 4 | 34 | 47 | 7 ms | 9 ms | 0.00% | 10% | pass |
| coarse 5 | 51 | 72 | 8 ms | 11 ms | 0.00% | 15% | pass |
| coarse 6 | 76 | 106 | 8 ms | 12 ms | 0.00% | 21% | pass |
| coarse 7 | 114 | 159 | 9 ms | 13 ms | 0.00% | 29% | pass |
| coarse 8 | 171 | 238 | 9 ms | 14 ms | 0.00% | 36% | pass |
| coarse 9 | 256 | 360 | 8 ms | 12 ms | 0.00% | 39% | pass |
| coarse 10 | 384 | 538 | 7 ms | 11 ms | 0.00% | 42% | pass |
| coarse 11 | 577 | 808 | 5 ms | 10 ms | 0.00% | 41% | pass |
| coarse 12 | 865 | 1212 | 4 ms | 7 ms | 0.00% | 48% | pass |
| coarse 13 | 1297 | 1812 | 3 ms | 5 ms | 0.00% | 47% | pass |
| coarse 14 | 1946 | 2722 | 2 ms | 4 ms | 0.00% | 59% | pass |
| coarse 15 | 2919 | 3531 | 1310 ms | 16922 ms | 0.51% | 94% | fail: p95 1310 ms, p99 16922 ms, k6 dropped 7.0% of sessions |
| fine 1 | 2141 | 2993 | 3 ms | 5 ms | 0.00% | 66% | pass |
| fine 2 | 2335 | 3265 | 3 ms | 8 ms | 0.00% | 71% | pass |
| fine 3 | 2530 | 3545 | 4 ms | 10 ms | 0.00% | 75% | pass |
| fine 4 | 2724 | 3818 | 8 ms | 195 ms | 0.00% | 78% | pass |

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
