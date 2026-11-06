# Batch 20261104-054709

Started 2026-11-04T05:47:09+00:00, finished 2026-11-04T06:23:12+00:00

## Median per configuration

| Configuration | Ref | Commit | Runs passed | Median req/s | Range | Median p95 |
| --- | --- | --- | --- | --- | --- | --- |
| node-tuned | node-tuned | 814f326280 | 0 of 1 | - | - | - |
| rails-tuned | rails-tuned | 9aa5bfb8c0 | 0 of 1 | - | - | - |
| spring-tuned | spring-tuned | 17b0155dd5 | 0 of 1 | - | - | - |

A configuration needs all its runs to pass for its median to be a result.

## Every run, in order

| # | Configuration | Status | Req/s | Sessions/s | p95 | p99 | Calibration | Minutes | Results |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | node-tuned | aborted | - | - | - | - | 18.87 s | 12.3 | `results/node/none/20261104-054709-quick` |
| 2 | rails-tuned | complete | - | - | - | - | 22.04 s | 11.6 | `results/rails/none/20261104-060129-quick` |
| 3 | spring-tuned | complete | - | - | - | - | 20.41 s | 8.1 | `results/spring/none/20261104-061507-quick` |

## Validity checks per run

Each run's summary.md has the full table with every measured value.

| # | Configuration | Checks passed | Failed | Mac CPU peak | Nginx vs k6 | Writes stored |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | node-tuned | 2 of 3 | Core speed (calibration) | - | - | - |
| 2 | rails-tuned | 2 of 3 | Core speed (calibration) | - | - | - |
| 3 | spring-tuned | 2 of 3 | Core speed (calibration) | - | - | - |

## Warnings

- Run 1: calibration 18.87 s is 244% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 1: aborted: k6 ran out of virtual users (--max-vus 10000), so it could not start every session: the load generator was the limit. Rerun with --max-vus 20000
- Run 2: calibration 22.04 s is 301% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 3: calibration 20.41 s is 272% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
