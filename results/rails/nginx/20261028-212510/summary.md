# rails / nginx

Run `rails-nginx-20261028-212510`, 2026-10-28T21:25:10+01:00 to 2026-10-28T21:57:26+01:00

**Aborted, not a valid result:** k6 could not open 3 connections while the server answered in p95 6 ms. That is the Mac or the VM network, not the stack. Most likely the Mac firewall's connection limit: check `sudo pfctl -s memory`, see Network in harness/README.md. Details: /Users/raju4789/Raju/projects/one-cpu-which-backend-wins/results/rails/nginx/20261028-212510/k6-confirm-2724.log

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
| Core speed (calibration) | 5.47 s (-0.4% vs 5.49 s) | < +3% | ok |
| Code fingerprint | harness 9aa5bfb8c0, stack 9aa5bfb8c0 (rails-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 8 ms | 11 ms | 0.00% | 5% | pass |
| coarse 2 | 15 | 21 | 8 ms | 11 ms | 0.00% | 7% | pass |
| coarse 3 | 22 | 31 | 8 ms | 11 ms | 0.00% | 9% | pass |
| coarse 4 | 34 | 47 | 8 ms | 11 ms | 0.00% | 11% | pass |
| coarse 5 | 51 | 72 | 8 ms | 11 ms | 0.00% | 14% | pass |
| coarse 6 | 76 | 106 | 8 ms | 12 ms | 0.00% | 20% | pass |
| coarse 7 | 114 | 159 | 9 ms | 13 ms | 0.00% | 28% | pass |
| coarse 8 | 171 | 241 | 9 ms | 14 ms | 0.00% | 38% | pass |
| coarse 9 | 256 | 362 | 8 ms | 13 ms | 0.00% | 42% | pass |
| coarse 10 | 384 | 539 | 7 ms | 11 ms | 0.00% | 42% | pass |
| coarse 11 | 577 | 808 | 6 ms | 10 ms | 0.00% | 45% | pass |
| coarse 12 | 865 | 1212 | 4 ms | 8 ms | 0.00% | 44% | pass |
| coarse 13 | 1297 | 1815 | 3 ms | 5 ms | 0.00% | 49% | pass |
| coarse 14 | 1946 | 2724 | 3 ms | 5 ms | 0.00% | 59% | pass |
| coarse 15 | 2919 | 3602 | 1186 ms | 15082 ms | 0.36% | 92% | fail: p95 1186 ms, p99 15082 ms, k6 dropped 5.4% of sessions |
| fine 1 | 2141 | 3003 | 3 ms | 6 ms | 0.00% | 56% | pass |
| fine 2 | 2335 | 3265 | 3 ms | 7 ms | 0.00% | 71% | pass |
| fine 3 | 2530 | 3541 | 4 ms | 15 ms | 0.00% | 74% | pass |
| fine 4 | 2724 | 3808 | 5 ms | 21 ms | 0.00% | 81% | pass |

Idle baseline: the VM used 2% of the core with no load (monitoring agents and Postgres).
Calibration: 5.47 s.
