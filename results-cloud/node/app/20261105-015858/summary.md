# node / app

Run `node-app-20261105-015858`, 2026-11-05T01:58:58+00:00 to 2026-11-05T02:33:28+00:00

**Warning:** calibration 21.40 s is 290% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **224 req/s** | 160 | 641 | 2 ms | 19 ms | 42 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 28% | 133 MB |
| bench-cadvisor-1 | 0% | 23 MB |
| bench-nginx-1 | 8% | 33 MB |
| bench-nginx-exporter-1 | 0% | 7 MB |
| bench-postgres-1 | 10% | 454 MB |
| bench-postgres-exporter-1 | 1% | 9 MB |
| whole VM | 46% | 915 MB |

The Mac running k6 peaked at 16% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 16% | < 70% | ok |
| Mac memory compressed during the run | - | < 2 GB | - |
| k6 process, peak | 0.6 cores, 449 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 21.40 s (+289.8% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 72,065 vs 72,064 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 72,076 vs 72,075 (+0.00%) | within 2% | ok |
| Writes stored (data check) | 17,083 posts stored for 17,071 acknowledged, 51,240 likes for 51,202 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 9885a54f9d, stack 814f326280 (node-tuned) | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 14 ms | 23 ms | 0.00% | 9% | pass |
| coarse 2 | 15 | 21 | 18 ms | 40 ms | 0.00% | 14% | pass |
| coarse 3 | 22 | 31 | 14 ms | 30 ms | 0.00% | 15% | pass |
| coarse 4 | 34 | 47 | 16 ms | 28 ms | 0.00% | 22% | pass |
| coarse 5 | 51 | 71 | 16 ms | 34 ms | 0.00% | 25% | pass |
| coarse 6 | 76 | 108 | 47 ms | 279 ms | 0.00% | 38% | pass |
| coarse 7 | 114 | 160 | 34 ms | 105 ms | 0.00% | 45% | pass |
| coarse 8 | 171 | 239 | 8012 ms | 11237 ms | 0.07% | 71% | fail: p95 8012 ms, p99 11237 ms |
| fine 1 | 125 | 173 | 24 ms | 66 ms | 0.00% | 43% | pass |
| fine 2 | 137 | 191 | 25 ms | 77 ms | 0.00% | 46% | pass |
| fine 3 | 148 | 207 | 76 ms | 451 ms | 0.00% | 47% | pass |
| fine 4 | 160 | 224 | 24 ms | 74 ms | 0.00% | 46% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 336 | 55 ms | 142 ms | 0.00% |
| back at 1x | 223 | 19 ms | 43 ms | 0.00% |

Recovered.

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 21.4 s.
