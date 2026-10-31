# Batch 20261031-203248

Started 2026-10-31T20:32:48+01:00, finished 2026-10-31T23:15:35+01:00

## Median per configuration

| Configuration | Ref | Commit | Runs passed | Median req/s | Range | Median p95 |
| --- | --- | --- | --- | --- | --- | --- |
| rails-tuned-nginx | rails-tuned | 9aa5bfb8c0 | 3 of 3 | **3545** | 3540 to 3546 | 4 ms |

A configuration needs all its runs to pass for its median to be a result.

## Every run, in order

| # | Configuration | Status | Req/s | Sessions/s | p95 | p99 | Calibration | Minutes | Results |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | rails-tuned-nginx | complete | 3540 | 2530 | 4 ms | 38 ms | 5.53 s | 47.6 | `results/rails/nginx/20261031-203248` |
| 2 | rails-tuned-nginx | complete | 3545 | 2530 | 4 ms | 29 ms | 5.46 s | 47.6 | `results/rails/nginx/20261031-213024` |
| 3 | rails-tuned-nginx | complete | 3546 | 2530 | 4 ms | 20 ms | 5.44 s | 47.6 | `results/rails/nginx/20261031-222800` |

## Validity checks per run

Each run's summary.md has the full table with every measured value.

| # | Configuration | Checks passed | Failed | Mac CPU peak | Nginx vs k6 | Writes stored |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | rails-tuned-nginx | 11 of 11 | - | 25% | 1,141,545 vs 1,141,545 (+0.00%) | ok |
| 2 | rails-tuned-nginx | 11 of 11 | - | 22% | 1,142,669 vs 1,142,669 (+0.00%) | ok |
| 3 | rails-tuned-nginx | 11 of 11 | - | 19% | 1,142,764 vs 1,142,764 (+0.00%) | ok |
