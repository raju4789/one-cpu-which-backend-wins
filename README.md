# one-cpu-which-backend-wins

Same API. Same database. Same server with 1 CPU and 2 GB of RAM.
Spring Boot, Node.js and Rails. Which one serves the most traffic while staying fast?

## Why

Teams often scale out before they know what a single server can handle.
This project measures it, with every config, script and raw result public.

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

## Fair by design

Every stack gets the same hardware, database, API and load script.
Each is written the way production teams write it and tuned to best practice.
Full rules: [docs/rules.md](docs/rules.md)

## Repository layout

| Folder | Purpose |
| --- | --- |
| `harness/` | VM, Postgres, Nginx and monitoring setup |
| `contract/` | API spec and contract tests every stack must pass |
| `k6/` | Load test scripts |
| `stacks/` | Node.js, Spring Boot and Rails implementations |
| `results/` | Raw output from every run |
| `docs/` | Rules, methodology and decisions |

## Think a stack is tuned badly?

Open an issue or a pull request with the change. Better configs get rerun and credited.
