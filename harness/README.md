# Harness

The shared test environment. Every stack runs on exactly this setup.

```
Mac (host)
├── k6                      load generator, outside both VMs
├── bench VM   1 vCPU, 2 GB   the "$12 box"
│   ├── Nginx               port 8080 on the Mac
│   ├── app                 the stack under test
│   ├── Postgres            seeded once, reset before every run
│   └── cAdvisor, Postgres exporter
└── monitor VM 2 vCPU, 2 GB
    ├── Prometheus          port 9090, receives k6 metrics
    └── Grafana             port 3000
```

## Setup

```sh
brew install colima docker docker-compose k6
harness/bin/vm-up
```

Once the harness passes `bin/check`, freeze the images so every stack runs on byte-identical ones:

```sh
harness/bin/pin-images
git commit -am "Pin harness images by digest"
```

The first `bin/up` on a new VM seeds Postgres (50,000 users, 500,000 posts, 2,000,000 likes). That takes a few minutes, once. After that, every run starts from a fresh copy in seconds.

## Run a stack

```sh
harness/bin/up <stack> <phase>    # e.g. harness/bin/up dummy-app none
harness/bin/check                 # verifies VM shape, data, Nginx mode, monitoring
harness/bin/smoke                 # 30-second smoke load, watch it in Grafana
harness/bin/down
```

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
| `bin/pin-images` | Pin every image to its current digest. Run once when freezing the harness |

## How a stack plugs in

A stack is a folder with a `compose.yaml` that only adds `image` or `build` for the `app` service. The harness supplies everything else. See [`dummy-app/`](dummy-app) for the smallest example.

The app gets these environment variables:

| Variable | Value |
| --- | --- |
| `PORT` | `8080` |
| `DATABASE_URL` | `postgres://bench:bench@postgres:5432/app` |
| `FEED_CACHE` | `app` in the app-cache phase, otherwise `off` |

## The dummy app

`dummy-app/` serves the contract's endpoints from memory, with no database. It exists only to prove the harness works end to end before a real stack exists. It is never benchmarked.
