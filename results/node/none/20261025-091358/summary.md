# node / none

Run `node-none-20261025-091358`, 2026-10-25T09:13:59+01:00 to 2026-10-25T09:16:59+01:00

**Aborted, not a valid result:** k6 could not open 4 connections while the server answered in p95 15 ms. That is the Mac or the VM network, not the stack. Most likely the Mac firewall's connection limit: check `sudo pfctl -s memory`, see Network in harness/README.md. Details: /Users/raju4789/Raju/projects/one-cpu-which-backend-wins/results/node/none/20261025-091358/k6-warmup.log

## Result

No rate passed the 5-minute confirm.

## Ramp

| Step | Sessions/s | Req/s | p95 | p99 | Errors | Server CPU | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |

Idle baseline: the VM used 5% of the core with no load (monitoring agents and Postgres).
Calibration: 5.85 s.
