# Batch 20261104-161056

Started 2026-11-04T16:10:56+00:00, finished 2026-11-05T16:59:53+00:00

## Median per configuration

| Configuration | Ref | Commit | Runs passed | Median req/s | Range | Median p95 |
| --- | --- | --- | --- | --- | --- | --- |
| node-untuned | node-untuned | 43614a0612 | 3 of 3 | **117** | 78 to 148 | 89 ms |
| node-tuned | node-tuned | 814f326280 | 3 of 3 | **100** | 99 to 106 | 51 ms |
| node-tuned-app | node-tuned | 814f326280 | 3 of 3 | **224** | 175 to 466 | 38 ms |
| node-tuned-nginx | node-tuned | 814f326280 | 3 of 3 | **358** | 287 to 394 | 65 ms |
| rails-tuned | rails-tuned | 9aa5bfb8c0 | 3 of 3 | **92** | 86 to 99 | 89 ms |
| rails-tuned-app | rails-tuned | 9aa5bfb8c0 | 3 of 3 | **99** | 99 to 239 | 25 ms |
| rails-tuned-nginx | rails-tuned | 9aa5bfb8c0 | 3 of 3 | **239** | 224 to 263 | 29 ms |
| spring-untuned | spring-untuned | b58c287e3f | 3 of 3 | **128** | 128 to 148 | 60 ms |
| spring-tuned | spring-tuned | 17b0155dd5 | 3 of 3 | **100** | 44 to 138 | 35 ms |
| spring-tuned-app | spring-tuned | 17b0155dd5 | 3 of 3 | **430** | 335 to 592 | 50 ms |
| spring-tuned-nginx | spring-tuned | 17b0155dd5 | 3 of 3 | **590** | 394 to 645 | 53 ms |

A configuration needs all its runs to pass for its median to be a result.

## Every run, in order

| # | Configuration | Status | Req/s | Sessions/s | p95 | p99 | Calibration | Minutes | Results |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | node-untuned | complete | 78 | 56 | 29 ms | 60 ms | 21.56 s | 34.1 | `results/node/none/20261104-161057` |
| 2 | node-tuned | complete | 99 | 71 | 46 ms | 221 ms | 19.77 s | 34.8 | `results/node/none/20261104-165502` |
| 3 | node-tuned-app | complete | 466 | 333 | 101 ms | 269 ms | 21.62 s | 36.6 | `results/node/app/20261104-173949` |
| 4 | node-tuned-nginx | complete | 394 | 282 | 105 ms | 319 ms | 21.47 s | 34.6 | `results/node/nginx/20261104-182623` |
| 5 | rails-tuned | complete | 99 | 71 | 89 ms | 165 ms | 20.51 s | 38.0 | `results/rails/none/20261104-191057` |
| 6 | rails-tuned-app | complete | 99 | 71 | 19 ms | 37 ms | 22.56 s | 32.5 | `results/rails/app/20261104-195857` |
| 7 | rails-tuned-nginx | complete | 224 | 160 | 29 ms | 61 ms | 21.68 s | 34.6 | `results/rails/nginx/20261104-204130` |
| 8 | spring-untuned | complete | 148 | 106 | 74 ms | 968 ms | 24.08 s | 36.3 | `results/spring/none/20261104-212604` |
| 9 | spring-tuned | complete | 44 | 31 | 15 ms | 29 ms | 22.85 s | 31.7 | `results/spring/none/20261104-221221` |
| 10 | spring-tuned-app | complete | 335 | 239 | 15 ms | 29 ms | 21.86 s | 36.1 | `results/spring/app/20261104-225403` |
| 11 | spring-tuned-nginx | complete | 590 | 422 | 53 ms | 756 ms | 19.24 s | 36.1 | `results/spring/nginx/20261104-234006` |
| 12 | node-untuned | complete | 148 | 106 | 244 ms | 400 ms | 19.71 s | 33.3 | `results/node/none/20261105-002610` |
| 13 | node-tuned | complete | 106 | 76 | 52 ms | 276 ms | 21.69 s | 39.5 | `results/node/none/20261105-010926` |
| 14 | node-tuned-app | complete | 224 | 160 | 19 ms | 42 ms | 21.4 s | 34.5 | `results/node/app/20261105-015858` |
| 15 | node-tuned-nginx | complete | 358 | 256 | 53 ms | 180 ms | 20.7 s | 33.5 | `results/node/nginx/20261105-024329` |
| 16 | rails-tuned | complete | 86 | 61 | 40 ms | 77 ms | 20.87 s | 31.4 | `results/rails/none/20261105-032657` |
| 17 | rails-tuned-app | complete | 239 | 171 | 72 ms | 139 ms | 20.72 s | 41.6 | `results/rails/app/20261105-040824` |
| 18 | rails-tuned-nginx | complete | 263 | 188 | 26 ms | 61 ms | 21.39 s | 33.7 | `results/rails/nginx/20261105-050003` |
| 19 | spring-untuned | complete | 128 | 91 | 48 ms | 86 ms | 24.52 s | 33.5 | `results/spring/none/20261105-054344` |
| 20 | spring-tuned | complete | 100 | 71 | 35 ms | 61 ms | 24.27 s | 33.5 | `results/spring/none/20261105-062714` |
| 21 | spring-tuned-app | complete | 592 | 422 | 87 ms | 187 ms | 20.54 s | 36.1 | `results/spring/app/20261105-071044` |
| 22 | spring-tuned-nginx | complete | 645 | 461 | 79 ms | 299 ms | 21.68 s | 37.3 | `results/spring/nginx/20261105-075651` |
| 23 | node-untuned | complete | 117 | 84 | 89 ms | 492 ms | 21.82 s | 31.5 | `results/node/none/20261105-084406` |
| 24 | node-tuned | complete | 100 | 71 | 51 ms | 132 ms | 20.61 s | 32.3 | `results/node/none/20261105-092538` |
| 25 | node-tuned-app | complete | 175 | 125 | 38 ms | 82 ms | 23.2 s | 32.7 | `results/node/app/20261105-100754` |
| 26 | node-tuned-nginx | complete | 287 | 205 | 65 ms | 187 ms | 24.96 s | 34.9 | `results/node/nginx/20261105-105038` |
| 27 | rails-tuned | complete | 92 | 66 | 142 ms | 417 ms | 20.83 s | 32.4 | `results/rails/none/20261105-113532` |
| 28 | rails-tuned-app | complete | 99 | 71 | 25 ms | 46 ms | 22.71 s | 32.7 | `results/rails/app/20261105-121754` |
| 29 | rails-tuned-nginx | complete | 239 | 171 | 29 ms | 65 ms | 23.11 s | 42.0 | `results/rails/nginx/20261105-130034` |
| 30 | spring-untuned | complete | 128 | 91 | 60 ms | 155 ms | 24.7 s | 33.6 | `results/spring/none/20261105-135234` |
| 31 | spring-tuned | complete | 138 | 99 | 104 ms | 234 ms | 24.69 s | 42.5 | `results/spring/none/20261105-143608` |
| 32 | spring-tuned-app | complete | 430 | 307 | 50 ms | 95 ms | 24.61 s | 45.7 | `results/spring/app/20261105-152836` |
| 33 | spring-tuned-nginx | complete | 394 | 282 | 46 ms | 131 ms | 24.04 s | 35.6 | `results/spring/nginx/20261105-162415` |

## Validity checks per run

Each run's summary.md has the full table with every measured value.

| # | Configuration | Checks passed | Failed | Mac CPU peak | Nginx vs k6 | Writes stored |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | node-untuned | 9 of 10 | Core speed (calibration) | 12% | 25,242 vs 25,242 (+0.00%) | ok |
| 2 | node-tuned | 9 of 10 | Core speed (calibration) | 16% | 31,987 vs 31,986 (+0.00%) | ok |
| 3 | node-tuned-app | 9 of 10 | Core speed (calibration) | 25% | 150,344 vs 150,344 (+0.00%) | ok |
| 4 | node-tuned-nginx | 9 of 10 | Core speed (calibration) | 26% | 127,102 vs 127,102 (+0.00%) | ok |
| 5 | rails-tuned | 9 of 10 | Core speed (calibration) | 12% | 32,010 vs 32,010 (+0.00%) | ok |
| 6 | rails-tuned-app | 9 of 10 | Core speed (calibration) | 12% | 32,058 vs 32,057 (+0.00%) | ok |
| 7 | rails-tuned-nginx | 9 of 10 | Core speed (calibration) | 17% | 72,316 vs 72,316 (+0.00%) | ok |
| 8 | spring-untuned | 9 of 10 | Core speed (calibration) | 11% | 47,763 vs 47,762 (+0.00%) | ok |
| 9 | spring-tuned | 9 of 10 | Core speed (calibration) | 10% | 14,006 vs 14,005 (+0.01%) | ok |
| 10 | spring-tuned-app | 9 of 10 | Core speed (calibration) | 22% | 107,790 vs 107,790 (+0.00%) | ok |
| 11 | spring-tuned-nginx | 9 of 10 | Core speed (calibration) | 29% | 190,339 vs 190,339 (+0.00%) | ok |
| 12 | node-untuned | 9 of 10 | Core speed (calibration) | 17% | 47,818 vs 47,818 (+0.00%) | ok |
| 13 | node-tuned | 9 of 10 | Core speed (calibration) | 11% | 34,283 vs 34,282 (+0.00%) | ok |
| 14 | node-tuned-app | 9 of 10 | Core speed (calibration) | 16% | 72,065 vs 72,064 (+0.00%) | ok |
| 15 | node-tuned-nginx | 9 of 10 | Core speed (calibration) | 23% | 115,551 vs 115,551 (+0.00%) | ok |
| 16 | rails-tuned | 9 of 10 | Core speed (calibration) | 17% | 27,627 vs 27,626 (+0.00%) | ok |
| 17 | rails-tuned-app | 9 of 10 | Core speed (calibration) | 17% | 77,217 vs 77,216 (+0.00%) | ok |
| 18 | rails-tuned-nginx | 9 of 10 | Core speed (calibration) | 19% | 84,692 vs 84,692 (+0.00%) | ok |
| 19 | spring-untuned | 9 of 10 | Core speed (calibration) | 15% | 41,170 vs 41,169 (+0.00%) | ok |
| 20 | spring-tuned | 9 of 10 | Core speed (calibration) | 13% | 32,189 vs 32,189 (+0.00%) | ok |
| 21 | spring-tuned-app | 9 of 10 | Core speed (calibration) | 30% | 190,697 vs 190,696 (+0.00%) | ok |
| 22 | spring-tuned-nginx | 9 of 10 | Core speed (calibration) | 27% | 208,102 vs 208,101 (+0.00%) | ok |
| 23 | node-untuned | 9 of 10 | Core speed (calibration) | 12% | 37,848 vs 37,848 (+0.00%) | ok |
| 24 | node-tuned | 9 of 10 | Core speed (calibration) | 13% | 32,141 vs 32,140 (+0.00%) | ok |
| 25 | node-tuned-app | 9 of 10 | Core speed (calibration) | 17% | 56,409 vs 56,409 (+0.00%) | ok |
| 26 | node-tuned-nginx | 9 of 10 | Core speed (calibration) | 23% | 92,559 vs 92,558 (+0.00%) | ok |
| 27 | rails-tuned | 9 of 10 | Core speed (calibration) | 13% | 29,691 vs 29,690 (+0.00%) | ok |
| 28 | rails-tuned-app | 9 of 10 | Core speed (calibration) | 12% | 32,064 vs 32,064 (+0.00%) | ok |
| 29 | rails-tuned-nginx | 9 of 10 | Core speed (calibration) | 21% | 77,011 vs 77,010 (+0.00%) | ok |
| 30 | spring-untuned | 9 of 10 | Core speed (calibration) | 20% | 41,267 vs 41,267 (+0.00%) | ok |
| 31 | spring-tuned | 9 of 10 | Core speed (calibration) | 15% | 44,675 vs 44,674 (+0.00%) | ok |
| 32 | spring-tuned-app | 9 of 10 | Core speed (calibration) | 28% | 138,780 vs 138,779 (+0.00%) | ok |
| 33 | spring-tuned-nginx | 9 of 10 | Core speed (calibration) | 31% | 127,083 vs 127,083 (+0.00%) | ok |

## Warnings

- Run 1: calibration 21.56 s is 293% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 2: calibration 19.77 s is 260% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 3: calibration 21.62 s is 294% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 4: calibration 21.47 s is 291% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 5: calibration 20.51 s is 274% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 6: calibration 22.56 s is 311% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 7: calibration 21.68 s is 295% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 8: calibration 24.08 s is 339% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 9: calibration 22.85 s is 316% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 10: calibration 21.86 s is 298% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 11: calibration 19.24 s is 250% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 12: calibration 19.71 s is 259% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 13: calibration 21.69 s is 295% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 14: calibration 21.40 s is 290% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 15: calibration 20.70 s is 277% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 16: calibration 20.87 s is 280% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 17: calibration 20.72 s is 277% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 18: calibration 21.39 s is 290% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 19: calibration 24.52 s is 347% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 20: calibration 24.27 s is 342% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 21: calibration 20.54 s is 274% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 22: calibration 21.68 s is 295% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 23: calibration 21.82 s is 297% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 24: calibration 20.61 s is 275% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 25: calibration 23.20 s is 323% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 26: calibration 24.96 s is 355% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 27: calibration 20.83 s is 279% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 28: calibration 22.71 s is 314% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 29: calibration 23.11 s is 321% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 30: calibration 24.70 s is 350% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 31: calibration 24.69 s is 350% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 32: calibration 24.61 s is 348% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
- Run 33: calibration 24.04 s is 338% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care
