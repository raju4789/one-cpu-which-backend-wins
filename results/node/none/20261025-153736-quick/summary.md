# node / none (quick run, for tuning only)

Run `node-none-20261025-153736`, 2026-10-25T15:37:36+01:00 to 2026-10-25T15:53:38+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1844 req/s** | 1318 | 5302 | 2 ms | 59 ms | 74 ms | 0.69% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 33% | 147 MB |
| bench-cadvisor-1 | 0% | 45 MB |
| bench-nginx-1 | 6% | 36 MB |
| bench-nginx-exporter-1 | 0% | 17 MB |
| bench-postgres-1 | 50% | 255 MB |
| bench-postgres-exporter-1 | 0% | 8 MB |
| whole VM | 91% | 779 MB |

The Mac running k6 peaked at 18% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 969 | 1356 | 5 ms | 17 ms | 0.00% | 63% | pass |
| coarse 2 | 1047 | 1464 | 9 ms | 22 ms | 0.00% | 67% | pass |
| coarse 3 | 1130 | 1582 | 12 ms | 31 ms | 0.00% | 77% | pass |
| coarse 4 | 1221 | 1708 | 23 ms | 51 ms | 0.08% | 80% | pass |
| coarse 5 | 1318 | 1844 | 59 ms | 74 ms | 0.69% | 91% | pass |
| coarse 6 | 1424 | 1913 | 160 ms | 4117 ms | 20.34% | 100% | fail: p99 4117 ms, errors 20.3% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 2543 | 94 ms | 110 ms | 42.74% |
| back at 1x | 1841 | 59 ms | 77 ms | 0.98% |

Recovered.

Idle baseline: the VM used 4% of the core with no load (monitoring agents and Postgres).
Calibration: 5.75 s.
