# Rails stack

The contract API in Ruby on Rails, built the way a production team would build it, and sized for one CPU and 2 GB.

| Layer | Choice |
| --- | --- |
| Runtime | Ruby 3.4.12, YJIT on (a Rails default), jemalloc |
| Web framework | Rails 8.1, API-only |
| Web server | Puma, 2 workers of 3 threads (untuned: one process, Rails's default) |
| Data access | ActiveRecord with the `pg` adapter |
| Logs | Rails's logger to stdout, warnings and errors only |
| Metrics | Prometheus format on port 9464 |

**Status:** passes [the contract test](../../k6/README.md#contract-test) in all three phases (31 of 31 checks each, 27 October 2026). The untuned version is tagged `rails-untuned`. Verified at runtime: YJIT on (`ruby_yjit_enabled 1`), pool of 3.

## Why these defaults

The untuned version is what `rails new --api` gives you, close to what Catawiki runs in production (Ruby 3.4.12, Rails 8.1, Puma in single mode, jemalloc, no GC tuning). Two differences, both deliberate:

- **3 Puma threads, not 5.** Three is Rails's default since 7.2. Five, Catawiki's setting, is a tuning candidate.
- **API-only.** The app only serves JSON, so it skips cookie, session and browser middleware, as a new API service would.

jemalloc and YJIT are in the baseline, not tuning steps: Rails's generated Dockerfile installs jemalloc, and `config.load_defaults` 7.2 or later turns YJIT on. Production runs both.

## Layout

```
app/
├── controllers/   health, feed, posts, likes; errors in application_controller.rb
├── models/        User, Post (the feed query), Like (atomic, idempotent likes)
└── lib/
    ├── feed.rb           GET /feed's JSON, from the cache when FEED_CACHE=app
    ├── feed_cache.rb     the 1-second cache, single flight (plain Ruby, unit tested)
    ├── database_errors.rb  foreign key violation -> 400 or 404 (unit tested)
    ├── request_ids.rb    X-User-Id and post id parsing (unit tested)
    ├── api_error.rb      errors with the contract's status codes
    └── app_metrics.rb    Prometheus metrics and their HTTP server
config/
├── puma.rb        threads, port, keep-alive, waits for the database at startup
├── database.yml   pool, statement timeout
├── application.rb, environments/production.rb
└── initializers/app_setup.rb  request timing
lib/app_server.rb  (app/lib) starts the metrics server and logs the boot line, once Puma has started
bin/pin            one-time: pins the Ruby image and writes Gemfile.lock
test/              unit tests (minitest), no database needed
```

## How the contract rules are met

| Rule | How |
| --- | --- |
| Feed in one query | `eager_load(:user)`: ActiveRecord joins users in the same SQL statement. `includes` would run a second query for the authors |
| Atomic, idempotent likes | One transaction: `INSERT ... ON CONFLICT DO NOTHING` on `likes` (`Like.insert`), then `UPDATE posts SET like_count = COALESCE(like_count, 0) + 1` only if a row was inserted (`update_counters`) |
| Unknown user is 400, missing post is 404 | For likes, no lookup query: the insert's foreign key violation names the constraint, which says which reference was missing. For new posts, Rails's default `belongs_to` check looks the user up, which also loads the author for the response |
| Validation | Ids must be positive integers up to 2^63 - 1. The body must be a string of 1 to 280 characters (model validations) |
| Errors as `{ "error": "..." }` | `rescue_from` in `ApplicationController`, and a catch-all route for 404s |
| `/health` means ready | Puma only loads the app after a connection to Postgres succeeds |
| `FEED_CACHE=app` | The serialized feed is cached for 1 second. Threads arriving while it reloads wait for that one query (single flight), so expiry never causes a stampede |

## Production practices

- **Rails's defaults, unless there's a reason.** Where this differs from `rails new --api`, the file says why: plain HTTP behind Nginx (no `force_ssl`), logs at `warn`, no Solid Queue, Solid Cache, Kamal or Thruster (nothing here uses them, and Nginx is already the proxy).
- **Keep-alive longer than Nginx's.** Puma keeps idle connections 75 s, longer than Nginx keeps its upstream connections, so Puma never closes one Nginx is about to reuse.
- **Graceful shutdown.** Puma is PID 1: on `SIGTERM` it stops accepting, finishes in-flight requests, then exits.
- **Waits for the database at startup** (up to 30 tries, 1 s apart) instead of crashing if Postgres is a moment late.
- **Limits.** Queries are cancelled after 5 s (`statement_timeout`). A request waits at most 5 s for a database connection (ActiveRecord's default `checkout_timeout`), the same as untuned Node.
- **Prepared statements**, ActiveRecord's default with Postgres.
- **Multi-stage image**, like Rails's generated Dockerfile: gems are compiled in the build stage; the runtime stage has no compilers and runs as an unprivileged user.
- **Exact versions** in `Gemfile.lock`, and the Ruby image pinned by digest.
- **Tests in the build.** The image build runs the unit tests and loads every file the way production does (`zeitwerk:check`), so a broken image is never built. The full behaviour against Postgres is checked by the contract test.

## Observability

**Logs.** Rails's logger to stdout. In benchmark runs the level is `warn`, the same rule for every stack: Nginx keeps the access log. At boot it logs one line with Ruby and Rails versions, threads, pool size and whether YJIT is on. Set `LOG_LEVEL=info` to see more.

**Metrics** on `:9464/metrics`:

| Metric | What it shows |
| --- | --- |
| `app_http_request_duration_seconds` | Time inside the app per route |
| `app_db_pool_connections{state}` | Connections in use, idle, and requests waiting for one |
| `app_feed_cache_requests_total{result}` | Hits and misses in the app-cache phase |
| `ruby_gc_count`, `ruby_gc_time_seconds` | Garbage collections and the time spent in them |
| `ruby_heap_live_slots` | Live objects on the heap |
| `ruby_yjit_enabled` | 1 if YJIT is on |

The `app_*` names are shared with the other stacks, so Grafana shows them side by side.

## Configuration

| Variable | Default | Set by |
| --- | --- | --- |
| `PORT` | 8080 | harness |
| `DATABASE_URL` | | harness |
| `FEED_CACHE` | `off` | harness, per phase |
| `RAILS_MAX_THREADS` | 3 | tuning: Puma threads and the pool size (5 tried, dropped) |
| `WEB_CONCURRENCY` | 2 (untuned: one process) | tuning: Puma workers |
| `DB_STATEMENT_TIMEOUT_MS` | 5000 | |
| `METRICS_PORT` | 9464 | |
| `LOG_LEVEL` | `warn` | |

## First-time setup

The Gemfile.lock and the Ruby image's digest are written once, on the Mac, by `bin/pin`. It pulls `ruby:3.4.12-slim` into the bench VM and resolves the gems inside it. Commit both files after.

```sh
stacks/rails/bin/pin
```

## Tuning log

Follows the [tuning plan](../../docs/tuning-plan.md): one production-grade change at a time, a quick run for each, kept only on a clear win.

**Untuned baseline, no-cache phase** (one full run, 27 October 2026, tag `rails-untuned`): **1,133 req/s** (808 sessions/s), p95 13 ms, p99 49 ms. Failed the next step, 865 sessions/s, on latency alone: p95 1,170 ms with no errors, as requests queued for Puma's 3 threads. Rails used 49% of the core, Postgres 27%, Nginx 5% (Node: Postgres 40 to 46%, Node about 30%). Didn't recover from overload: at 1.5x requests waited until k6's 60 s timeout, and back at 1x p95 stayed at 33 s with 5.7% errors. Calibration 3% slow. Run `results/rails/none/20261027-195146`.

**Quick baseline** (`results/rails/none/20261027-203227-quick`): passed 814 sessions/s (1,141 req/s, p95 38 ms), failed 879 (p95 1,372 ms); no recovery after overload (p95 36 s back at 1x). Calibration 4% slow.

| Date | Change | Why | Quick run before | Quick run after | Kept? |
| --- | --- | --- | --- | --- | --- |
| 28 Oct | Puma threads and pool 3 → 5 (`RAILS_MAX_THREADS`) | Catawiki's setting. More threads help only while requests wait on Postgres (27% of the core); on one core they also compete for the CPU and Ruby's global lock | 1,141 req/s (814 sessions/s); no recovery after overload. Calibration 4% slow, so rerun at normal speed (`20261028-062914-quick`): passed 879 sessions/s (1,230 req/s, p95 240 ms), failed 949 | Passed 814 (1,141 req/s), failed 879 on p95 975 ms; the same CPU split at every step (Rails 48%, Postgres 28% at 814). Overload at 814 sessions/s: back at 1x p95 1,017 ms, 2.1% errors, not recovered | Dropped, back to 3: no throughput gain, and a step lower than 3 threads at the same core speed. The core is full at the limit, so more threads only add contention. Overload can't be compared: each run tests at its own passing rate |
| 28 Oct | Load shedding: [rack-timeout](https://github.com/zombocom/rack-timeout) answers 503 with `Retry-After: 1` for requests that waited over 1 s, measured from Nginx's `X-Request-Start` (shared config, see the tuning plan). 15 s service timeout as a backstop | Under overload a queue formed in Puma and never drained: requests waited until k6's 60 s timeout, and the server spent its time on answers nobody would read | Passed 879 sessions/s (1,230 req/s), failed 949; no recovery after overload (p95 33 s back at 1x). Overload failures: 4,557 k6 timeouts, 2,312 502s, 2,492 504s | Passed 879 (1,231 req/s), failed 949: unchanged. Shedding worked (7,536 fast 503s at 1.5x), yet 6,630 requests still hit k6's 60 s timeout, plus 1,702 502s and 614 504s. Back at 1x: 18% errors (13,506 503s), p95 25 s, not recovered (`20261028-071848-quick`) | Dropped, and the Nginx header removed with it. Most of the wait happens before Puma accepts the connection (in the kernel's accept queue and in Nginx), where rack-timeout can't see it: Puma only takes a connection when a thread is free. And a rejected request still pays for Puma and the middleware before rack-timeout, a large share of a request this cheap, so shedding frees little CPU. Node could shed cheaply because its queue was inside its own code and a rejected request skipped the database |
| 28 Oct | Considered: cap Puma's queue so extra connections are refused fast | The wait happens before Puma takes the connection | | Not built. Puma 8's source shows it accepts every connection it can and queues it internally, so there's no held-back queue to cap. `queue_requests false` also turns off keep-alive, so Nginx would open a connection per request. A smaller listen backlog doesn't refuse on Linux: a full backlog drops new connections silently, and Nginx retries for up to 60 s. Likely cause of the long waits: Puma accepts on one Ruby thread, which takes turns with the request threads for Ruby's global lock and accepts one connection per turn, so with the core full, connections pile up in the operating system's queue | Skipped |
| 28 Oct | Diagnostic, not a change: after the overload, recover at 70% of the rate (`bin/run --recover-at 70`) | Is Rails stuck after overload, or just without spare capacity to dig out? | | Passed 814 sessions/s, failed 879 (p95 818 ms, no errors). Back at 570 sessions/s: no errors and all the demand served (798 req/s), but p95 1,030 ms and p99 1,083 ms, so still failing. Evidence from the same run: the app's listen queue overflowed **157,145** times (`ListenOverflows` in `/proc/net/netstat`), and in Nginx's log of the last 89,000 requests, 9,137 took Rails 0.9 to 1.3 s against 3,391 between 0.1 and 0.9 s: a spike at Linux's 1 s retry for a dropped connection, not a queue (`20261028-075613-quick`) | The overload trap is Puma accepting connections too slowly, not Rails's speed. Under overload Nginx needs more connections than the 64 it keeps open; the new ones overflow the listen queue and retry 1 s later, which keeps latency up, which keeps Nginx opening connections, even at 70% load |
| 28 Oct | Puma workers 0 → 2 (`WEB_CONCURRENCY`), 3 threads each, app preloaded | Each process has its own accept loop and global lock, and the OS switches processes far more often than Ruby switches threads, so new connections should be accepted before the queue overflows. Metrics come from worker 0 only (one metrics port) | Passed 879 sessions/s (1,230 req/s), failed 949; no recovery after overload (p95 33 s back at 1x) | pending | |
