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
| Load test, contract test and runner | Done, verified with the dummy app |
| Node.js, Spring Boot, Rails | Not started |

## Blog series

1. [How far can a backend go on 1 CPU and 2 GB RAM?](https://medium.com/@narasimha4789/how-far-can-a-backend-go-on-1-cpu-and-2-gb-ram-c60d09710b59) Why this project exists
2. [My benchmark was lying. Here's how I caught it](https://medium.com/@narasimha4789/my-benchmark-was-lying-heres-how-i-caught-it-33f79d6c7703) How the test is kept fair and honest
3. Node.js: coming soon
4. Spring Boot: coming soon
5. Rails: coming soon
6. Head-to-head comparison: coming soon

## Results

Results are added here as each stack is tested.

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
Every run records a CPU calibration. The final comparison will interleave the stacks and report the median of three runs.
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
| [`k6/`](k6) | The load test and the contract test |
| [`results/`](results) | Raw output of every benchmark run |
| [`docs/`](docs) | The fairness rules |

Added as the project moves on: `stacks/`, with one folder per stack.

## Think a stack is tuned badly?

Open an issue or a pull request with the change. Better configs get rerun and credited.
