# Batch 20261103-055403

Started 2026-11-03T05:54:03+01:00, finished 2026-11-03T12:26:43+01:00

## Median per configuration

| Configuration | Ref | Commit | Runs passed | Median req/s | Range | Median p95 |
| --- | --- | --- | --- | --- | --- | --- |
| spring-untuned | spring-untuned | b58c287e3f | 0 of 3 | - | - | - |
| spring-tuned | spring-tuned | 17b0155dd5 | 3 of 3 | **2363** | 2359 to 2364 | 46 ms |
| spring-tuned-app | spring-tuned | 17b0155dd5 | 0 of 3 | - | - | - |
| spring-tuned-nginx | spring-tuned | 17b0155dd5 | 0 of 3 | - | - | - |

A configuration needs all its runs to pass for its median to be a result.

## Every run, in order

| # | Configuration | Status | Req/s | Sessions/s | p95 | p99 | Calibration | Minutes | Results |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | spring-untuned | complete | - | - | - | - | 5.54 s | 18.0 | `results/spring/none/20261103-055403` |
| 2 | spring-tuned | complete | 2363 | 1686 | 49 ms | 78 ms | 5.46 s | 38.6 | `results/spring/none/20261103-062202` |
| 3 | spring-tuned-app | complete | - | - | - | - | 5.5 s | 19.4 | `results/spring/app/20261103-071040` |
| 4 | spring-tuned-nginx | complete | - | - | - | - | 5.47 s | 19.4 | `results/spring/nginx/20261103-074003` |
| 5 | spring-untuned | complete | - | - | - | - | 5.46 s | 17.3 | `results/spring/none/20261103-080929` |
| 6 | spring-tuned | complete | 2364 | 1686 | 29 ms | 60 ms | 5.45 s | 38.5 | `results/spring/none/20261103-083648` |
| 7 | spring-tuned-app | complete | - | - | - | - | 5.5 s | 18.4 | `results/spring/app/20261103-092519` |
| 8 | spring-tuned-nginx | complete | - | - | - | - | 5.47 s | 19.4 | `results/spring/nginx/20261103-095342` |
| 9 | spring-untuned | complete | - | - | - | - | 5.46 s | 17.3 | `results/spring/none/20261103-102306` |
| 10 | spring-tuned | complete | 2359 | 1686 | 46 ms | 81 ms | 5.46 s | 38.5 | `results/spring/none/20261103-105025` |
| 11 | spring-tuned-app | complete | - | - | - | - | 5.45 s | 18.4 | `results/spring/app/20261103-113856` |
| 12 | spring-tuned-nginx | complete | - | - | - | - | 5.47 s | 19.4 | `results/spring/nginx/20261103-120717` |

## Validity checks per run

Each run's summary.md has the full table with every measured value.

| # | Configuration | Checks passed | Failed | Mac CPU peak | Nginx vs k6 | Writes stored |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | spring-untuned | 3 of 3 | - | - | - | - |
| 2 | spring-tuned | 11 of 11 | - | 17% | 761,795 vs 761,795 (+0.00%) | ok |
| 3 | spring-tuned-app | 3 of 3 | - | - | - | - |
| 4 | spring-tuned-nginx | 3 of 3 | - | - | - | - |
| 5 | spring-untuned | 3 of 3 | - | - | - | - |
| 6 | spring-tuned | 11 of 11 | - | 18% | 761,908 vs 761,908 (+0.00%) | ok |
| 7 | spring-tuned-app | 3 of 3 | - | - | - | - |
| 8 | spring-tuned-nginx | 3 of 3 | - | - | - | - |
| 9 | spring-untuned | 3 of 3 | - | - | - | - |
| 10 | spring-tuned | 11 of 11 | - | 17% | 760,557 vs 760,556 (+0.00%) | ok |
| 11 | spring-tuned-app | 3 of 3 | - | - | - | - |
| 12 | spring-tuned-nginx | 3 of 3 | - | - | - | - |

## Warnings

- Run 3: the Mac compressed 2.2 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on
