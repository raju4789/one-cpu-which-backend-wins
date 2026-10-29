# node / nginx (quick run, for tuning only)

Run `node-nginx-20261026-081258`, 2026-10-26T08:12:58+01:00 to 2026-10-26T08:28:11+01:00

**Warning:** the Mac compressed 2.3 GB more memory during the run: it was short of memory, so k6 may have slowed itself down. Lower --max-vus or close other apps, and don't trust latencies from this point on

## Result

| Sustained | Sessions/s | Concurrent users | p50 | p95 | p99 | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| **4232 req/s** | 3023 | 12107 | 0 ms | 13 ms | 73 ms | 0.03% |

At that rate the server used:

| Container | CPU (share of the core) | Memory (max) |
| --- | --- | --- |
| bench-app-1 | 40% | 187 MB |
| bench-cadvisor-1 | 0% | 35 MB |
| bench-nginx-1 | 17% | 73 MB |
| bench-nginx-exporter-1 | 0% | 15 MB |
| bench-postgres-1 | 19% | 408 MB |
| bench-postgres-exporter-1 | 0% | 13 MB |
| whole VM | 76% | 1056 MB |

The Mac running k6 peaked at 28% CPU.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| coarse 1 | 2400 | 3356 | 5 ms | 31 ms | 0.00% | 74% | pass |
| coarse 2 | 2592 | 3626 | 5 ms | 33 ms | 0.00% | 73% | pass |
| coarse 3 | 2799 | 3922 | 12 ms | 152 ms | 0.12% | 74% | pass |
| coarse 4 | 3023 | 4232 | 13 ms | 73 ms | 0.03% | 76% | pass |
| coarse 5 | 3265 | 4556 | 168 ms | 292 ms | 1.76% | 95% | fail: errors 1.8% |

## Overload

| Part | Req/s | p95 | p99 | Errors |
| --- | --- | --- | --- | --- |
| 1.5x | 6118 | 406 ms | 605 ms | 26.06% |
| back at 1x | 4231 | 7 ms | 46 ms | 0.18% |

Recovered.

Idle baseline: the VM used 3% of the core with no load (monitoring agents and Postgres).
Calibration: 5.61 s.
