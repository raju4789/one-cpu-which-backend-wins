# node / none (quick run, for tuning only)

Run `node-none-20261025-145314`, 2026-10-25T14:53:14+01:00 to 2026-10-25T15:06:04+01:00

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **1469 req/s** | 1047 | 4207 | 2 ms | 98 ms | 145 ms | 0.00% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 33% | 145 MB |
| bench-cadvisor-1 | 0% | 39 MB |
| bench-nginx-1 | 6% | 34 MB |
| bench-nginx-exporter-1 | 0% | 11 MB |
| bench-postgres-1 | 44% | 237 MB |
| bench-postgres-exporter-1 | 0% | 7 MB |
| whole VM | 88% | 669 MB |

The Mac running k6 peaked at 27% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 969 | 1354 | 22 ms | 50 ms | 0.00% | 79% | pass |
| coarse 2 | 1047 | 1469 | 98 ms | 145 ms | 0.00% | 88% | pass |
| coarse 3 | 1130 | 1536 | 5014 ms | 5166 ms | 12.56% | 93% | fail: p95 5014 ms, p99 5166 ms, errors 12.6%, k6 dropped 2.1% of sessions |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 1392 | 5032 ms | 5095 ms | 26.07% |
| back at 1x | 1365 | 5064 ms | 5173 ms | 27.65% |

Did not recover within 2 minutes.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.75 s.
