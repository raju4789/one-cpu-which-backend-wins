# Harness

The shared test environment. Every stack runs on exactly this setup, and nothing in it changes between stacks.

```
Mac (host)
├── k6                      load generator, outside both VMs
├── node_exporter           the Mac's own CPU, to prove k6 wasn't short of it
├── bench VM   1 vCPU, 2 GB   the "$12 box"
│   ├── Nginx               port 8080 on the VM's own IP
│   ├── app                 the stack under test
│   ├── Postgres            seeded once, reset before every run
│   └── cAdvisor, Postgres exporter, Nginx exporter
└── monitor VM 2 vCPU, 2 GB
    ├── Prometheus          port 9090, receives k6 metrics
    └── Grafana             port 3000
```

## Requirements

- Apple Silicon Mac. The VMs use Apple's virtualization and native arm64 images, so Intel Macs and Linux aren't supported as is.
- Homebrew
- 16 GB of RAM recommended. The two VMs take 4 GB.
- Docker Desktop closed. It runs its own VM and competes for CPU.
- The app you run commands from (Terminal, iTerm, or an editor like VS Code or Cursor) allowed under System Settings > Privacy & Security > Local Network, so k6 can reach the VMs.

## One-time setup

```sh
brew install colima docker docker-compose k6 node_exporter
brew services start node_exporter
docker compose version
```

If `docker compose version` fails, Docker can't find the Compose plugin. Add this to `~/.docker/config.json`:

```json
{ "cliPluginsExtraDirs": ["/opt/homebrew/lib/docker/cli-plugins"] }
```

## Quick start

```sh
harness/bin/vm-up                # start both VMs and monitoring
harness/bin/up dummy-app none    # fresh database, then the dummy app
harness/bin/check                # every line should say PASS
harness/bin/smoke                # 30 s of light load
```

Open http://localhost:3000 while `smoke` runs. The first `up` on a new VM seeds Postgres (50,000 users, 500,000 posts, 2,000,000 likes), which takes a few minutes, once. After that, every run starts from a fresh copy in seconds.

When you're done: `harness/bin/down` stops the stack, `harness/bin/vm-down` stops the VMs. Data is kept. To remove everything: `colima delete --profile bench` and `colima delete --profile monitor`.

## Test phases

`bin/up <stack> <phase>` starts a stack in one of three phases. Each phase changes exactly one thing.

| Phase | App cache | Nginx cache |
| --- | --- | --- |
| `none` | off | off |
| `app` | `/feed` for 1 s | off |
| `nginx` | off | `/feed` for 1 s |

## Scripts

| Script | What it does |
| --- | --- |
| `bin/vm-up`, `bin/vm-down` | Start or stop both VMs and the monitoring stack |
| `bin/up <stack> <phase>` | Fresh database, then the stack in the given phase |
| `bin/down` | Stop the stack |
| `bin/reset-db` | Replace the `app` database with a fresh copy of the seed |
| `bin/check` | Verify the environment matches [the rules](../docs/rules.md) |
| `bin/calibrate` | Fixed CPU benchmark in the VM. `BASELINE=<s>` fails if more than 5% off |
| `bin/env-report` | Environment as JSON, saved with every result |
| `bin/smoke` | Short load test through the full path, with metrics in Grafana |
| `bin/run <stack> <phase>` | The full benchmark for one stack in one phase, results saved to `results/` |
| `bin/pin-images` | Pin every image to its current digest (maintainers only, see below) |

## Run the benchmark

```sh
harness/bin/run <stack> <phase>    # e.g. harness/bin/run node none
```

Once after every reboot, raise the [Mac firewall's connection limit](#network) first, or a fast stack will hit it.

One command runs the whole protocol, about 30 minutes:

1. Fresh database, stack started in the phase
2. [Contract test](../k6/README.md#contract-test). The run stops if it fails
3. Idle baseline: what the server uses with no load
4. Calibration and environment report
5. Warm-up: 20 sessions/s for 2 minutes, the same for every stack
6. Coarse ramp: 1-minute steps, x1.5 each, until a step fails
7. Fine ramp: +10% steps from the last passing rate
8. Confirm: hold the best passing rate for 5 minutes. If it fails, try the next lower one
9. Overload: 2 minutes at 1.5x, then 2 minutes back, to see whether it recovers

A step passes while p95 < 300 ms, p99 < 1 s, errors < 1% and k6 dropped fewer than 1% of sessions. The result is the confirmed rate, saved with everything else in [`results/`](../results/README.md). Progress shows live in Grafana.

If the runner reports that k6 ran out of virtual users while the server was still fast, the load generator is the limit, not the stack: rerun with `--max-vus` higher. `bin/run --help` lists the other options.

The runner also stops a run it can't trust, and says why:

- **k6 couldn't connect while the server was fast.** Failed connections count as errors, so without this check a network problem on the Mac would show up as the stack failing. A server that is truly overloaded fails on latency too, and that is still recorded as a normal fail.
- **Prometheus didn't answer** after retrying for about 80 seconds.

The partial results are saved, marked aborted. They are not a result: fix the cause and rerun.

## What's where

Everything below is **locked**: changing it for one stack invalidates the comparison. To add or tune a stack, you only touch `stacks/<name>/`.

| Path | What it is |
| --- | --- |
| `compose.yaml` | The bench VM's services: Postgres, Nginx, the app slot, monitoring agents |
| `postgres/postgresql.conf` | Postgres settings, sized for the 1 vCPU, 2 GB box |
| `postgres/seed.sql`, `postgres/init/` | Deterministic seed data, built once into a template database |
| `nginx/nginx.conf` | Nginx settings, with keep-alive to the app |
| `nginx/modes/proxy`, `nginx/modes/cache` | How `/feed` is served: passed through, or cached for 1 second |
| `monitoring/` | Prometheus, Grafana and the dashboard |
| `smoke.js` | The smoke test, not the benchmark (that's [`k6/load.js`](../k6/README.md)) |
| `dummy-app/` | A stand-in app for testing the harness itself |

## How a stack plugs in

A stack is a folder with a `compose.yaml` that only adds `image` or `build` for the `app` service. The harness supplies everything else. See [`dummy-app/`](dummy-app) for the smallest example. The app must follow [the contract](../contract/README.md) and gets these environment variables:

| Variable | Value |
| --- | --- |
| `PORT` | `8080` |
| `DATABASE_URL` | `postgres://bench:bench@postgres:5432/app` |
| `FEED_CACHE` | `app` in the app-cache phase, otherwise `off` |

## The dummy app

`dummy-app/` implements the contract from memory, with no database, and passes the contract test. It proves the harness works end to end without a real stack, and it's the first thing to run when a result looks odd: if the dummy app also misbehaves, the harness is at fault, not the stack. It is never benchmarked.

## Grafana

Everything is on one dashboard at http://localhost:3000. Filter by stack and phase at the top.

| Section | What it shows |
| --- | --- |
| Summary | RPS, p95, p99, error rate, VUs, server CPU, red when past the pass criteria |
| Load (k6) | p50, p90, p95, p99, RPS and errors per endpoint, status codes, VUs |
| Server | CPU, memory, network and disk writes per container, against the 1 core and 2 GB |
| Nginx | Requests handled, active and idle connections |
| Postgres | Transactions, connections, cache hit ratio, rows, locks, deadlocks, size, top queries |
| App | Measured inside the stack: time per route, database pool, feed cache hits, runtime (event loop, heap, GC). Empty for stacks without metrics |
| Load generator | The Mac's CPU, to show k6 had headroom |

Percentiles come from k6 native histograms, so p95 and p99 are exact across all endpoints, not averaged. The dashboard is generated: edit `monitoring/grafana/build_dashboard.py`, then run it.

Monitoring isn't free: with the app idle, the agents and Postgres answering the exporter use about 5% of the core. It's the same for every stack.

## Pinned images

Every image is pinned by digest, so every stack runs on byte-identical Postgres, Nginx and monitoring. Don't run `bin/pin-images` to replicate results. Repinning changes the images, and every stack would then have to be rerun.

## Network

Each VM gets its own IP address on the Mac (`colima --network-address`), shown by `bin/vm-up` and `colima list`. k6 sends load straight to the bench VM's IP.

The load never goes through Colima's port forwarding to `localhost`. That forwarding is a user-space proxy: it uses the bench VM's own CPU, adds latency, and in testing it collapsed after a few hundred connections, taking every forwarded port down with it. `bin/check` fails if the load would go through it.

Prometheus does scrape the bench VM's exporters through that forwarding, because macOS doesn't let the two VMs reach each other directly. That's 3 small requests every 5 seconds, the same for every stack.

**The Mac firewall's connection limit.** The VMs' network turns on pf, the macOS firewall, which tracks every connection to them, including ones closed in the last 90 seconds. Once it tracks 10,000, it silently drops new connections to both VMs. k6 needs more than that from about 850 sessions/s (each virtual user holds a keep-alive connection, like a browser). Raise the limit before benchmarking. It loads only this one option and leaves the firewall's rules alone, and it resets on reboot:

```sh
echo "set limit states 200000" | sudo pfctl -O -f -
sudo pfctl -s memory    # states hard limit 200000
```

The limit only affects the load generator's side, and it's the same for every stack.

| Where | Port | Service |
| --- | --- | --- |
| bench VM | 8080 | Nginx, the entry point for all traffic |
| bench VM, forwarded to the Mac | 8081, 9113, 9187 | cAdvisor, Nginx exporter, Postgres exporter |
| bench VM, forwarded to the Mac | 9464 | The stack's own metrics, if it exposes them |
| bench VM | 5432 | Postgres, for debugging with `psql` |
| monitor VM | 9090 | Prometheus |
| Mac | 3000 | Grafana (forwarded, fine for a browser) |
| Mac | 9100 | node_exporter |

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `check` says a Prometheus target is down | Usually just started. `check` waits 20 s. If it still fails, check `colima list` shows both VMs running |
| k6 fails with "no route to host" while `curl` works | macOS blocks apps from the local network until you allow them, and Apple's own `curl` is exempt. System Settings > Privacy & Security > Local Network: turn on the app you run commands from (Terminal, iTerm, VS Code, Cursor), then quit it completely and reopen it. `bin/check` tests this |
| "a VM has no IP address" | The VM was created without `--network-address`. `bin/vm-up` restarts it with one |
| Requests suddenly fail with "connection refused" on `localhost` | Load went through Colima's port forwarding, which gave out. Unset `BASE_URL`, run `bin/vm-down` and `bin/vm-up` |
| Per-container panels are empty | The bench VM uses Docker's containerd image store, which cAdvisor can't read. `vm-up` switches it to overlay2; rerun `bin/vm-up` |
| `check` fails on the `mac` target | node_exporter isn't running: `brew services start node_exporter` |
| `up` hangs at "Waiting for the seed" | First run seeds 2.5 million rows. Give it up to 15 minutes; check `docker --context colima-bench logs bench-postgres-1` |
| k6 "dial: i/o timeout" and a Prometheus timeout at the same moment; `bin/run` says k6 could not connect | The Mac firewall's connection table is full (10,000 entries by default), so it drops new connections to the VMs. `sudo pfctl -s info` shows the `memory` counter rising. Raise the limit, see [Network](#network); it resets on reboot. It first showed up when k6 used one 10,000-user pool for the whole ramp, so every session opened a new connection; `load.js` now sizes the pool per step |
| `up` fails at "load metadata for docker.io/..." with "DeadlineExceeded" | The bench VM can't reach Docker Hub, usually after the Mac slept or changed network. Test with `colima ssh -p bench -- curl -sI https://registry-1.docker.io/v2/` (any HTTP status means it works). Fix with `bin/vm-down` and `bin/vm-up`. Stack base images pinned by digest build from the local copy |
| A cached `/feed` is up to 2 s old | Expected. Nginx counts cache expiry in whole seconds. See the [contract](../contract/README.md#design-decisions) |
