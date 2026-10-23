# one-cpu-which-backend-wins

Same API. Same database. Same server with 1 CPU and 2 GB of RAM.
Spring Boot, Node.js and Rails. Which one serves the most traffic while staying fast?

## Why

Teams often scale out before they know what a single server can handle.
This project measures it, with every config, script and raw result public.

## Status

| Part | State |
| --- | --- |
| Contract: API and database schema | Done |
| Harness: VMs, Postgres, Nginx, monitoring | Done, verified end to end with a dummy app |
| Load test script and runner | In progress |
| Node.js, Spring Boot, Rails | Not started |

## Results

Results are added here as each blog post is published.

1. Node.js: coming soon
2. Spring Boot: coming soon
3. Rails: coming soon
4. Head-to-head comparison: coming soon

## How it works

- A VM with 1 vCPU and 2 GB runs Nginx, the app and Postgres together
- k6 generates load from outside the VM
- Prometheus and Grafana run in a separate VM, so monitoring never uses the test budget
- Data: 50,000 users, 500,000 posts, 2,000,000 likes
- A run passes while p95 < 300 ms, p99 < 1 s and errors < 1%

Headline metric: max sustained requests per second within those limits.

**What the results mean.** They show which stack does best on one core under identical conditions. They are not a prediction of what a specific cloud server handles: a Mac core is faster than a shared cloud vCPU, so absolute numbers will differ.

## Fair by design

Every stack gets the same hardware, database, API and load script.
Each is written the way production teams write it and tuned to best practice.
Laptop noise is controlled with a calibration check, interleaved runs and medians of three.
Full rules: [docs/rules.md](docs/rules.md)

## Run it yourself

Needs an Apple Silicon Mac with Homebrew and 16 GB of RAM (the two VMs take 4 GB). After the [one-time setup](harness/README.md#one-time-setup):

```sh
git clone https://github.com/raju4789/one-cpu-which-backend-wins.git
cd one-cpu-which-backend-wins
harness/bin/vm-up                # start both VMs and monitoring
harness/bin/up dummy-app none    # first run seeds Postgres, takes a few minutes
harness/bin/check                # every line should say PASS
harness/bin/smoke                # 30 s of light load, watch it at http://localhost:3000
```

## Repository layout

| Folder | What's in it |
| --- | --- |
| [`contract/`](contract) | The API and database schema every stack must implement |
| [`harness/`](harness) | The test environment and the scripts that run it |
| [`docs/`](docs) | The fairness rules |

Added as the project moves on: `k6/` for the load test and contract tests, `stacks/` with one folder per stack, and `results/` with the raw output of every run.

## Think a stack is tuned badly?

Open an issue or a pull request with the change. Better configs get rerun and credited.
