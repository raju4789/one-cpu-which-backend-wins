# Batch 20261028-172131

Started 2026-10-28T17:21:31+01:00, finished 2026-10-29T00:14:38+01:00

## Median per configuration

| Configuration | Ref | Commit | Runs passed | Median req/s | Range | Median p95 |
| --- | --- | --- | --- | --- | --- | --- |
| rails-tuned | rails-tuned | 9aa5bfb8c0 | 3 of 3 | **1211** | 1132 to 1212 | 24 ms |
| rails-tuned-app | rails-tuned | 9aa5bfb8c0 | 3 of 3 | **2544** | 2542 to 2544 | 12 ms |
| rails-tuned-nginx | rails-tuned | 9aa5bfb8c0 | 1 of 3 | **3543** | 3543 to 3543 | 4 ms |

A configuration needs all its runs to pass for its median to be a result.

## Every run, in order

| # | Configuration | Status | Req/s | Sessions/s | p95 | p99 | Calibration | Minutes | Results |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | rails-tuned | complete | 1212 | 865 | 24 ms | 82 ms | 5.44 s | 34.5 | `results/rails/none/20261028-172132` |
| 2 | rails-tuned-app | complete | 2544 | 1816 | 11 ms | 56 ms | 5.44 s | 38.5 | `results/rails/app/20261028-180604` |
| 3 | rails-tuned-nginx | complete | 3543 | 2530 | 4 ms | 12 ms | 5.46 s | 47.6 | `results/rails/nginx/20261028-185433` |
| 4 | rails-tuned | complete | 1211 | 865 | 112 ms | 171 ms | 5.45 s | 34.5 | `results/rails/none/20261028-195208` |
| 5 | rails-tuned-app | complete | 2542 | 1816 | 25 ms | 96 ms | 5.44 s | 38.5 | `results/rails/app/20261028-203641` |
| 6 | rails-tuned-nginx | aborted | - | - | - | - | 5.47 s | 32.3 | `results/rails/nginx/20261028-212510` |
| 7 | rails-tuned | complete | 1132 | 808 | 13 ms | 52 ms | 5.45 s | 36.4 | `results/rails/none/20261028-220727` |
| 8 | rails-tuned-app | complete | 2544 | 1816 | 12 ms | 56 ms | 5.47 s | 38.5 | `results/rails/app/20261028-225353` |
| 9 | rails-tuned-nginx | aborted | - | - | - | - | 5.45 s | 32.3 | `results/rails/nginx/20261028-234222` |

## Validity checks per run

Each run's summary.md has the full table with every measured value.

| # | Configuration | Checks passed | Failed | Mac CPU peak | Nginx vs k6 | Writes stored |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | rails-tuned | 11 of 11 | - | 19% | 390,775 vs 390,775 (+0.00%) | ok |
| 2 | rails-tuned-app | 11 of 11 | - | 18% | 820,223 vs 820,223 (+0.00%) | ok |
| 3 | rails-tuned-nginx | 11 of 11 | - | 20% | 1,142,263 vs 1,142,263 (+0.00%) | ok |
| 4 | rails-tuned | 11 of 11 | - | 20% | 390,665 vs 390,666 (-0.00%) | ok |
| 5 | rails-tuned-app | 10 of 11 | Nginx vs k6 request count (overload) | 47% | 819,404 vs 819,404 (+0.00%) | ok |
| 6 | rails-tuned-nginx | 3 of 3 | - | - | - | - |
| 7 | rails-tuned | 11 of 11 | - | 18% | 364,892 vs 364,892 (+0.00%) | ok |
| 8 | rails-tuned-app | 11 of 11 | - | 20% | 820,283 vs 820,284 (-0.00%) | ok |
| 9 | rails-tuned-nginx | 3 of 3 | - | - | - | - |

## Warnings

- Run 5: overload: Nginx counted 469243 requests but k6 recorded 455125 (+3.1%). One of them is wrong, most likely k6: don't trust this test's numbers
- Run 6: aborted: k6 could not open 3 connections while the server answered in p95 6 ms. That is the Mac or the VM network, not the stack. Most likely the Mac firewall's connection limit: check `sudo pfctl -s memory`, see Network in harness/README.md. Details: /Users/raju4789/Raju/projects/one-cpu-which-backend-wins/results/rails/nginx/20261028-212510/k6-confirm-2724.log
- Run 9: aborted: k6 could not open 241 connections while the server answered in p95 6 ms. That is the Mac or the VM network, not the stack. Most likely the Mac firewall's connection limit: check `sudo pfctl -s memory`, see Network in harness/README.md. Details: /Users/raju4789/Raju/projects/one-cpu-which-backend-wins/results/rails/nginx/20261028-234222/k6-confirm-2724.log
