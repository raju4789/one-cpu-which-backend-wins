# rails / none

Run `rails-none-20261027-195146`, 2026-10-27T19:51:46+01:00 to 2026-10-27T20:28:27+01:00

**Warning:** calibration 5.66 s is 3% slower than the reference 5.49 s (harness/calibration-reference): the core was slower. Is something else running on the Mac? Compare this run with care

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1133 req/s** | 808 | 3236 | 1 ms | 13 ms | 49 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 49% | 115 MB |
| bench-cadvisor-1 | 0% | 31 MB |
| bench-nginx-1 | 4% | 46 MB |
| bench-nginx-exporter-1 | 0% | 10 MB |
| bench-postgres-1 | 27% | 567 MB |
| bench-postgres-exporter-1 | 0% | 16 MB |
| whole VM | 81% | 1242 MB |

The Mac running k6 peaked at 34% CPU.

## Validity checks

The evidence that the server, not the environment, set this result.

| Check | Measured | Limit | |
| --- | --- | --- | --- |
| Mac CPU, peak (k6 runs there) | 34% | < 70% | ok |
| Mac memory compressed during the run | 0.0 GB | < 2 GB | ok |
| k6 process, peak | 0.77 cores, 2099 MB | for reference | - |
| Sessions k6 couldn't start (dropped) | 0 (0.00%) | < 1% | ok |
| Connections k6 couldn't open | 0 | 0 | ok |
| k6 ran out of virtual users | 0 | 0 | ok |
| Mac asleep during the run | 0 s | 0 s | ok |
| Core speed (calibration) | 5.66 s (+3.1% vs 5.49 s) | < +3% | **FAIL** |
| Nginx vs k6 request count (confirm) | 365,354 vs 365,354 (+0.00%) | within 2% | ok |
| Nginx vs k6 request count (overload) | 263,689 vs 261,443 (+0.86%) | within 2% | ok |
| Writes stored (data check) | 76,076 posts stored for 76,060 acknowledged, 225,074 likes for 225,044 | all acknowledged writes stored, like counts consistent | ok |
| Code fingerprint | harness 6610e6577b, stack 6610e6577b | everything committed | ok |

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 13 ms | 16 ms | 0.00% | 12% | pass |
| coarse 2 | 15 | 21 | 13 ms | 16 ms | 0.00% | 16% | pass |
| coarse 3 | 22 | 31 | 13 ms | 15 ms | 0.00% | 23% | pass |
| coarse 4 | 34 | 48 | 13 ms | 18 ms | 0.00% | 30% | pass |
| coarse 5 | 51 | 71 | 12 ms | 16 ms | 0.00% | 38% | pass |
| coarse 6 | 76 | 106 | 10 ms | 13 ms | 0.00% | 46% | pass |
| coarse 7 | 114 | 160 | 8 ms | 11 ms | 0.00% | 43% | pass |
| coarse 8 | 171 | 240 | 7 ms | 11 ms | 0.00% | 51% | pass |
| coarse 9 | 256 | 359 | 5 ms | 7 ms | 0.00% | 59% | pass |
| coarse 10 | 384 | 537 | 4 ms | 6 ms | 0.00% | 61% | pass |
| coarse 11 | 577 | 809 | 3 ms | 7 ms | 0.00% | 66% | pass |
| coarse 12 | 865 | 1119 | 1170 ms | 1196 ms | 0.00% | 94% | fail: p95 1170 ms, p99 1196 ms |
| fine 1 | 635 | 890 | 3 ms | 12 ms | 0.00% | 64% | pass |
| fine 2 | 692 | 970 | 3 ms | 8 ms | 0.00% | 67% | pass |
| fine 3 | 750 | 1048 | 4 ms | 33 ms | 0.00% | 77% | pass |
| fine 4 | 808 | 1130 | 11 ms | 77 ms | 0.00% | 80% | pass |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 971 | 59999 ms | 60000 ms | 7.10% |
| back at 1x | 954 | 32933 ms | 60000 ms | 5.68% |

Did not recover within 2 minutes.

Idle baseline: the VM used 6% of the core with no load (monitoring agents and Postgres).
Calibration: 5.66 s.
