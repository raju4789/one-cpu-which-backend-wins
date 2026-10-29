# Batch 20261025-215528

Started 2026-10-25T21:55:28+01:00, finished 2026-10-26T07:44:10+01:00

## Median per configuration

| Configuration | Ref | Commit | Runs passed | Median req/s | Range | Median p95 |
| --- | --- | --- | --- | --- | --- | --- |
| node-untuned | node-untuned | 43614a0612 | 3 of 3 | **1698** | 1212 to 1817 | 17 ms |
| node-tuned | node-tuned | 814f326280 | 3 of 3 | **1815** | 1812 to 1816 | 18 ms |
| node-tuned-app | node-tuned | 814f326280 | 3 of 3 | **4496** | 4089 to 4497 | 12 ms |
| node-tuned-nginx | node-tuned | 814f326280 | 3 of 3 | **4903** | 4901 to 4904 | 28 ms |

A configuration needs all its runs to pass for its median to be a result.

## Every run, in order

| # | Configuration | Status | Req/s | Sessions/s | p95 | p99 | Calibration | Minutes | Results |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | node-untuned | complete | 1698 | 1211 | 17 ms | 49 ms | 5.53 s | 37.0 | `results/node/none/20261025-215529` |
| 2 | node-tuned | complete | 1816 | 1297 | 18 ms | 48 ms | 5.46 s | 35.3 | `results/node/none/20261025-224231` |
| 3 | node-tuned-app | complete | 4496 | 3211 | 11 ms | 84 ms | 5.44 s | 47.1 | `results/node/app/20261025-232749` |
| 4 | node-tuned-nginx | complete | 4904 | 3503 | 32 ms | 180 ms | 5.47 s | 39.3 | `results/node/nginx/20261026-002452` |
| 5 | node-untuned | complete | 1212 | 865 | 4 ms | 14 ms | 5.45 s | 43.0 | `results/node/none/20261026-011409` |
| 6 | node-tuned | complete | 1815 | 1297 | 17 ms | 49 ms | 5.45 s | 44.0 | `results/node/none/20261026-020708` |
| 7 | node-tuned-app | complete | 4497 | 3211 | 30 ms | 184 ms | 5.45 s | 38.2 | `results/node/app/20261026-030106` |
| 8 | node-tuned-nginx | complete | 4903 | 3503 | 28 ms | 164 ms | 5.46 s | 39.3 | `results/node/nginx/20261026-034919` |
| 9 | node-untuned | complete | 1817 | 1297 | 78 ms | 114 ms | 5.46 s | 35.1 | `results/node/none/20261026-043836` |
| 10 | node-tuned | complete | 1812 | 1297 | 29 ms | 81 ms | 5.45 s | 44.0 | `results/node/none/20261026-052344` |
| 11 | node-tuned-app | complete | 4089 | 2919 | 12 ms | 39 ms | 5.46 s | 37.2 | `results/node/app/20261026-061742` |
| 12 | node-tuned-nginx | complete | 4901 | 3503 | 26 ms | 155 ms | 5.45 s | 39.3 | `results/node/nginx/20261026-070455` |

## Warnings

- Run 3: the Mac compressed 2.0 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on
- Run 3: overload test not valid: aborted with "k6 ran out of virtual users (--max-vus 20000), so it could n...". A bug in bin/run: the warning came from the 1.5x phase, where running short of virtual users is expected, but was judged against the recovery phase. The confirmed result was measured and checked before the overload test and stands. Fixed 26 Oct 2026
- Run 4: overload test not valid: aborted with "k6 ran out of virtual users (--max-vus 20000), so it could n...". A bug in bin/run: the warning came from the 1.5x phase, where running short of virtual users is expected, but was judged against the recovery phase. The confirmed result was measured and checked before the overload test and stands. Fixed 26 Oct 2026
- Run 5: overload test not valid: aborted with "k6 ran out of virtual users (--max-vus 10000), so it could n...". A bug in bin/run: the warning came from the 1.5x phase, where running short of virtual users is expected, but was judged against the recovery phase. The confirmed result was measured and checked before the overload test and stands. Fixed 26 Oct 2026
- Run 8: overload test not valid: aborted with "k6 ran out of virtual users (--max-vus 20000), so it could n...". A bug in bin/run: the warning came from the 1.5x phase, where running short of virtual users is expected, but was judged against the recovery phase. The confirmed result was measured and checked before the overload test and stands. Fixed 26 Oct 2026
- Run 11: the Mac compressed 3.2 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on
- Run 11: overload test not valid: aborted with "k6 ran out of virtual users (--max-vus 20000), so it could n...". A bug in bin/run: the warning came from the 1.5x phase, where running short of virtual users is expected, but was judged against the recovery phase. The confirmed result was measured and checked before the overload test and stands. Fixed 26 Oct 2026
- Run 12: the Mac compressed 2.2 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on
- Run 12: overload test not valid: aborted with "k6 ran out of virtual users (--max-vus 20000), so it could n...". A bug in bin/run: the warning came from the 1.5x phase, where running short of virtual users is expected, but was judged against the recovery phase. The confirmed result was measured and checked before the overload test and stands. Fixed 26 Oct 2026
