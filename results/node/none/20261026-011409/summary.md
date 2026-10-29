# node / none

Run `node-none-20261026-011409`, 2026-10-26T01:14:09+01:00 to 2026-10-26T01:57:08+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1212 req/s** | 865 | 3462 | 1 ms | 4 ms | 14 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 23% | 198 MB |
| bench-cadvisor-1 | 0% | 46 MB |
| bench-nginx-1 | 4% | 47 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 31% | 358 MB |
| bench-postgres-exporter-1 | 0% | 10 MB |
| whole VM | 57% | 1035 MB |

The Mac running k6 peaked at 15% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 10 | 14 | 10 ms | 18 ms | 0.00% | 10% | pass |
| coarse 2 | 15 | 21 | 10 ms | 19 ms | 0.00% | 13% | pass |
| coarse 3 | 22 | 31 | 9 ms | 13 ms | 0.00% | 16% | pass |
| coarse 4 | 34 | 47 | 10 ms | 15 ms | 0.00% | 24% | pass |
| coarse 5 | 51 | 71 | 10 ms | 17 ms | 0.00% | 32% | pass |
| coarse 6 | 76 | 106 | 11 ms | 17 ms | 0.00% | 40% | pass |
| coarse 7 | 114 | 159 | 10 ms | 18 ms | 0.00% | 48% | pass |
| coarse 8 | 171 | 238 | 8 ms | 14 ms | 0.00% | 45% | pass |
| coarse 9 | 256 | 358 | 7 ms | 14 ms | 0.00% | 51% | pass |
| coarse 10 | 384 | 535 | 5 ms | 14 ms | 0.00% | 54% | pass |
| coarse 11 | 577 | 809 | 4 ms | 14 ms | 0.00% | 55% | pass |
| coarse 12 | 865 | 1208 | 4 ms | 15 ms | 0.00% | 58% | pass |
| coarse 13 | 1297 | 1815 | 109 ms | 163 ms | 0.00% | 84% | pass |
| coarse 14 | 1946 | 1758 | 3304 ms | 3352 ms | 21.50% | 92% | fail: p95 3304 ms, p99 3352 ms, errors 21.5%, k6 dropped 35.7% of sessions |
| fine 1 | 1427 | 1849 | 3129 ms | 3315 ms | 21.25% | 92% | fail: p95 3129 ms, p99 3315 ms, errors 21.3%, k6 dropped 7.3% of sessions |

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.45 s.
