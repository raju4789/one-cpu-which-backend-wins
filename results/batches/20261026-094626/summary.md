# Batch 20261026-094626

Started 2026-10-26T09:46:26+01:00, finished 2026-10-26T19:26:40+01:00

## Median per configuration

| Configuration | Ref | Commit | Runs passed | Median req/s | Range | Median p95 |
| --- | --- | --- | --- | --- | --- | --- |
| node-untuned | node-untuned | 43614a0612 | 3 of 3 | **1814** | 1694 to 1815 | 48 ms |
| node-tuned | node-tuned | 814f326280 | 3 of 3 | **1817** | 1815 to 1817 | 23 ms |
| node-tuned-app | node-tuned | 814f326280 | 3 of 3 | **4906** | 4495 to 4906 | 64 ms |
| node-tuned-nginx | node-tuned | 814f326280 | 3 of 3 | **4905** | 4898 to 4907 | 19 ms |

A configuration needs all its runs to pass for its median to be a result.

## Every run, in order

| # | Configuration | Status | Req/s | Sessions/s | p95 | p99 | Calibration | Minutes | Results |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | node-untuned | complete | 1694 | 1211 | 16 ms | 49 ms | 5.55 s | 37.5 | `results/node/none/20261026-094627` |
| 2 | node-tuned | complete | 1815 | 1297 | 23 ms | 69 ms | 5.49 s | 44.6 | `results/node/none/20261026-103354` |
| 3 | node-tuned-app | complete | 4906 | 3503 | 238 ms | 456 ms | 5.46 s | 39.6 | `results/node/app/20261026-112829` |
| 4 | node-tuned-nginx | complete | 4907 | 3503 | 17 ms | 62 ms | 5.45 s | 39.7 | `results/node/nginx/20261026-121808` |
| 5 | node-untuned | complete | 1814 | 1297 | 83 ms | 203 ms | 5.46 s | 35.5 | `results/node/none/20261026-130749` |
| 6 | node-tuned | complete | 1817 | 1297 | 54 ms | 141 ms | 5.44 s | 44.6 | `results/node/none/20261026-135322` |
| 7 | node-tuned-app | complete | 4906 | 3503 | 64 ms | 180 ms | 5.45 s | 39.6 | `results/node/app/20261026-144756` |
| 8 | node-tuned-nginx | complete | 4905 | 3503 | 19 ms | 107 ms | 5.45 s | 39.7 | `results/node/nginx/20261026-153734` |
| 9 | node-untuned | complete | 1815 | 1297 | 48 ms | 89 ms | 5.48 s | 35.6 | `results/node/none/20261026-162716` |
| 10 | node-tuned | complete | 1817 | 1297 | 17 ms | 52 ms | 5.46 s | 35.5 | `results/node/none/20261026-171249` |
| 11 | node-tuned-app | complete | 4495 | 3211 | 23 ms | 138 ms | 5.47 s | 38.6 | `results/node/app/20261026-175821` |
| 12 | node-tuned-nginx | complete | 4898 | 3503 | 28 ms | 190 ms | 5.44 s | 39.7 | `results/node/nginx/20261026-184659` |

## Validity checks per run

Each run's summary.md has the full table with every measured value.

| # | Configuration | Checks passed | Failed | Mac CPU peak | Nginx vs k6 | Writes stored |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | node-untuned | 11 of 11 | - | 15% | 546,295 vs 546,295 (+0.00%) | ok |
| 2 | node-tuned | 11 of 11 | - | 19% | 585,324 vs 585,324 (+0.00%) | ok |
| 3 | node-tuned-app | 11 of 11 | - | 23% | 1,581,161 vs 1,581,162 (-0.00%) | ok |
| 4 | node-tuned-nginx | 11 of 11 | - | 24% | 1,581,554 vs 1,581,554 (+0.00%) | ok |
| 5 | node-untuned | 11 of 11 | - | 20% | 585,212 vs 585,213 (-0.00%) | ok |
| 6 | node-tuned | 11 of 11 | - | 26% | 585,758 vs 585,758 (+0.00%) | ok |
| 7 | node-tuned-app | 11 of 11 | - | 23% | 1,581,319 vs 1,581,319 (+0.00%) | ok |
| 8 | node-tuned-nginx | 11 of 11 | - | 23% | 1,581,095 vs 1,581,095 (+0.00%) | ok |
| 9 | node-untuned | 11 of 11 | - | 19% | 585,456 vs 585,456 (+0.00%) | ok |
| 10 | node-tuned | 11 of 11 | - | 18% | 585,465 vs 585,466 (-0.00%) | ok |
| 11 | node-tuned-app | 11 of 11 | - | 28% | 1,448,896 vs 1,448,896 (+0.00%) | ok |
| 12 | node-tuned-nginx | 11 of 11 | - | 29% | 1,579,395 vs 1,579,395 (+0.00%) | ok |
