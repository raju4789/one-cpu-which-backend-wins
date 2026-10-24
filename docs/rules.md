# Rules

These rules keep the comparison fair. A result only counts if it follows all of them.

## Locked for every stack

1. **Hardware:** one Colima VM with 1 vCPU and 2 GB RAM. Nginx, the app and Postgres all run inside it.
2. **Load generator:** k6 runs on the host, outside the VM. Prometheus and Grafana run in a separate VM.
3. **Database:** same Postgres version, config, schema, indexes and seed data.
4. **API:** every stack passes the same contract tests before it is load tested.
5. **Load:** same k6 script, ramp, think time and pass criteria. The load is an open model: k6 starts a fixed number of user sessions per second however slow the server gets, so overload shows as real latency instead of slowing the load down. Details in [k6/README.md](../k6/README.md).
6. **Queries:** same work per request. One query for the feed, no N+1.
7. **Logging:** Nginx writes the one access log. Apps log warnings and errors only, no per-request lines. Rails logs every request by default and Spring doesn't, so "info level everywhere" would not be equal work.
8. **Nginx:** one shared config with keepalive to the app.
9. **Repeatability:** a warm-up run before measuring, and every test run three times.

## Environment

The goal is to measure the stack, not the laptop. Anything outside the app that could change a result is either fixed or measured.

### Same machine state

1. **Native images only.** Every image runs as arm64. No amd64 images under emulation, which would slow one stack for reasons that have nothing to do with it.
2. **Production mode.** `NODE_ENV=production`, `RAILS_ENV=production`, Spring with a prod profile and no devtools.
3. **Pinned versions.** Each runtime uses its current stable LTS, and every image is pinned by digest. Postgres and Nginx images are identical for all stacks.
4. **Database on the VM's own disk.** Postgres data never lives on a folder shared from the Mac, since shared folders are much slower.
5. **Fresh start per run.** A fresh copy of the seeded database (already `VACUUM ANALYZE`d), then a warm-up of the same length for every stack.
6. **Monitoring inside the VM is the same for every stack.** cAdvisor and the Postgres exporter cost a little CPU, so they run with the same settings and scrape interval every time.

### Same laptop state

1. **Plugged in**, Low Power Mode off.
2. **Quiet machine.** Browser, IDE, Docker Desktop, Spotlight indexing and backups are closed or paused during runs.
3. **Cool-down.** At least 5 minutes idle between runs, so thermal throttling from one run doesn't carry into the next.
4. **k6 must not be the bottleneck.** The Mac's CPU is recorded in Grafana for every run. Above 70%, k6 may be slowing the bench VM down, and the run is flagged.

### Noise control

macOS can't pin a VM to specific cores, so the VM may land on fast or efficiency cores. We can't remove that noise, so we spread it evenly and detect it.

1. **Interleaved order.** Runs go Node, Spring, Rails, Node, Spring, Rails, and so on, never three Node runs in a row. Any drift during a session hits every stack equally.
2. **Calibration check.** Before each run, a fixed CPU benchmark runs inside the VM. If it's more than 5% off the session baseline, the run is discarded.
3. **Three runs, report the median**, and show the spread.

### Recorded with every result

Laptop model, macOS version, Colima version, image digests, calibration score and the time of the run. Anyone can then see exactly what produced a number.

## Pass criteria

A load level passes when, held for 5 minutes:

- p95 latency < 300 ms
- p99 latency < 1 s
- error rate < 1%

k6 must also drop fewer than 1% of sessions, otherwise the load generator, not the stack, was the limit.

The headline result is the highest sustained requests per second that still passes. It is found with 1-minute ramp steps, then confirmed with a 5-minute hold, by [`harness/bin/run`](../harness/README.md#run-the-benchmark).

## Endpoints

| Method | Path | Does |
| --- | --- | --- |
| `GET` | `/feed` | Latest 20 posts with author name and like count |
| `POST` | `/posts` | Creates a post |
| `POST` | `/posts/:id/like` | Likes a post |

## Implementation style

Each stack is written the way production teams write it: the framework's normal ORM, production mode, standard good practices.

| Stack | Framework | Data access |
| --- | --- | --- |
| Node.js | Fastify | Prisma |
| Java | Spring Boot | Spring Data JPA (Hibernate) |
| Ruby | Rails (API mode) | ActiveRecord |

## Allowed tuning per stack

| Stack | What can be tuned |
| --- | --- |
| Node.js | pg pool size, serialization, Node version |
| Spring Boot | heap size, GC (Serial GC on one core), virtual threads, HikariCP pool |
| Rails | Puma workers and threads, YJIT, jemalloc, ActiveRecord pool |

Every tuning change is committed with a short reason, so readers can see why it was made.

## Test phases

Each stack is tested in three phases:

1. No cache
2. In-app cache of `GET /feed` for 1 second
3. Nginx micro-cache of `GET /feed` for 1 second, with `proxy_cache_lock`

Two extra tests per stack:

- **Past the peak:** 50% above the max stable load. Does it degrade or collapse, and does it recover?
- **Warm-up:** the curve from cold start to full speed.
