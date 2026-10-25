# Node.js stack

The contract API in Node.js, built the way a production team would build it, and sized for one CPU and 2 GB.

| Layer | Choice |
| --- | --- |
| Runtime | Node.js 24 LTS, one process |
| Web framework | [Fastify 5](https://fastify.dev) |
| Data access | [Prisma 7](https://www.prisma.io) with the `pg` driver adapter |
| Language | TypeScript, compiled to JavaScript in the image |
| Logs | pino (Fastify's logger), JSON, warnings and errors only |
| Metrics | Prometheus format on port 9464 |
| Traces | OpenTelemetry, off by default |

Passes [the contract test](../../k6/README.md#contract-test) in all three phases.

## Layout

```
src/
├── main.ts           entry point: loads tracing first if enabled, then the server
├── server.ts         startup, readiness, graceful shutdown
├── app.ts            Fastify instance, error handling, request timing
├── config.ts         everything configurable, from environment variables
├── db.ts             the Postgres pool and the Prisma client
├── metrics.ts        Prometheus metrics and their HTTP server
├── feedCache.ts      the 1-second feed cache for the app-cache phase
├── errors.ts         API errors and how database errors map to them
├── tracing.ts        OpenTelemetry setup
└── posts/
    ├── routes.ts     the three endpoints
    ├── schemas.ts    JSON schemas: request validation and response serialization
    └── service.ts    the queries
prisma/schema.prisma  maps the shared tables, never migrates them
test/                 unit tests (node:test), no database needed
```

## How the contract rules are met

| Rule | How |
| --- | --- |
| Feed in one query | `relationLoadStrategy: "join"`: Prisma loads each post's author with a `LATERAL JOIN` in the same SQL statement. Without it, Prisma runs a second query for the authors. Verified with `pg_stat_statements`: one statement per feed request |
| Atomic, idempotent likes | One transaction: `INSERT ... ON CONFLICT DO NOTHING` on `likes` (Prisma's `createMany` with `skipDuplicates`), then `UPDATE posts SET like_count = like_count + 1` only if a row was inserted (Prisma's `increment`) |
| Unknown user is 400, missing post is 404 | No extra lookup query: the insert's foreign key violation (Prisma error `P2003`) names the constraint, which says which reference was missing |
| Validation | Fastify JSON schemas, checked by Ajv before the handler runs. Ids above 2^53 - 1 are rejected as 400, since JavaScript can't represent them exactly |
| Errors as `{ "error": "..." }` | One error handler for everything |
| `/health` means ready | The server only starts listening after a query to Postgres succeeds |
| `FEED_CACHE=app` | The serialized feed is cached for 1 second. Concurrent requests during a reload share the same query (single flight), so expiry never causes a stampede |

## Production practices

- **One process.** One CPU means one event loop. Cluster mode or worker threads would add processes fighting over the same core.
- **Responses serialized from schemas.** Fastify uses `fast-json-stringify` with the response schema, faster than `JSON.stringify` because the shape is known.
- **Keep-alive longer than Nginx's.** Node keeps idle connections 75 s, longer than Nginx keeps its upstream connections, so Node never closes one Nginx is about to reuse.
- **Graceful shutdown.** On `SIGTERM`, stop accepting connections, finish in-flight requests, close the pool, then exit. The grace period (8 s) is shorter than Docker's stop timeout (10 s), so the process exits on its own terms.
- **Waits for the database at startup** (up to 30 tries, 1 s apart) instead of crashing if Postgres is a moment late.
- **Survives a broken idle connection.** `pg` reports it as an `error` event, which would crash the process if unhandled. It's logged, and the pool replaces the connection.
- **Fails loudly on bugs.** An unhandled rejection or exception is logged as `fatal` in the same JSON format, then the process exits instead of running in an unknown state.
- **Limits.** Queries are cancelled after 5 s (`statement_timeout`), so a stuck query can't hold a connection. Request bodies are capped at 16 KB.
- **Load shedding.** At most `DB_POOL_MAX + DB_MAX_QUEUE` requests (10 + 100) may be using or waiting for a database connection. The next one gets `503` with `Retry-After: 1` straight away, instead of joining a queue that can grow to thousands (`src/limiter.ts`). No request waits more than 1 s for a connection. Cached feeds and `/health` are never shed.
- **Multi-stage image.** The build stage compiles TypeScript and generates the Prisma client. The runtime stage has only production dependencies and compiled code, runs as the unprivileged `node` user, with `NODE_ENV=production`.
- **Exact versions** in `package.json` and a lockfile, so every build installs the same code.
- **Tests in the build.** `npm test` runs unit tests for the feed cache, the error mapping and every HTTP status, with the database replaced by a fake. The image build runs them, so an image that fails them is never built. The full behaviour against Postgres is checked by the [contract test](../../k6/README.md#contract-test).

## Observability

**Logs.** pino writes JSON lines to stdout. In benchmark runs the level is `warn`, the same rule for every stack: Nginx keeps the access log. Set `LOG_LEVEL=info` to see more when debugging.

**Metrics** on `:9464/metrics`, scraped by Prometheus and shown in the Grafana App row.

| Metric | What it shows |
| --- | --- |
| `app_http_request_duration_seconds` | Time inside the app per route. Compared with k6's latency, it shows how much is the app and how much is everything around it |
| `app_db_pool_connections{state}` | Connections in use, idle, and requests waiting for one. Waiting above zero means the pool, not the CPU, is the limit |
| `app_feed_cache_requests_total{result}` | Hits and misses in the app-cache phase |
| `nodejs_eventloop_lag_*` | How late the event loop runs. On one CPU, rising lag is the clearest sign the process is saturated |
| `nodejs_heap_*`, `nodejs_gc_*` | Memory and garbage collection |

The `app_*` names are shared with the other stacks, so Grafana can show them side by side.

**Traces.** OpenTelemetry instruments HTTP, the `pg` driver and Prisma, but only with `OTEL_ENABLED=true`. When it's off, none of its code is even loaded. It stays off in benchmark runs: tracing every request costs CPU, and on one core that would change the result. Configure it with the standard variables, for example `OTEL_EXPORTER_OTLP_ENDPOINT`, or `OTEL_TRACES_EXPORTER=console` to print spans.

## Configuration

| Variable | Default | Set by |
| --- | --- | --- |
| `PORT` | 8080 | harness |
| `DATABASE_URL` | | harness |
| `FEED_CACHE` | `off` | harness, per phase |
| `METRICS_PORT` | 9464 | |
| `DB_POOL_MAX` | 10 | tuning |
| `DB_MAX_QUEUE` | 100 | tuning |
| `DB_CONNECT_TIMEOUT_MS` | 1000 | tuning |
| `DB_STATEMENT_TIMEOUT_MS` | 5000 | |
| `LOG_LEVEL` | `warn` | |
| `OTEL_ENABLED` | `false` | |

## Tuning log

Tuning follows the [tuning plan](../../docs/tuning-plan.md): one production-grade change at a time, a quick run for each, kept only on a clear win.

**Untuned baseline, no-cache phase** (three full runs, 25 October 2026): median **1,694 req/s** (1,211 sessions/s), range 1,573 to 1,818, p95 13 to 39 ms at the confirmed rate. Postgres used 40 to 46% of the core, Node 28 to 30%. Node didn't recover from overload in any run: once a queue of thousands of requests formed at the database pool, it stayed. Runs `results/node/none/20261025-114855`, `-124346` and `-132854`.

| Date | Change | Why | Quick run before | Quick run after | Kept? |
| --- | --- | --- | --- | --- | --- |
| 25 Oct | Load shedding: at most 110 requests using or waiting for a database connection, then 503; connection wait 5 s → 1 s | Under overload, a queue of thousands formed at the pool and never drained, even after the load dropped | 1,709 req/s (1,221 sessions/s); no recovery after overload | pending | |

Starting point: pool of 10, a 5-second wait for a database connection, default heap, one process. The quick baseline (`results/node/none/20261025-151815-quick`, with the tuned Postgres settings) passed 1,221 sessions/s (1,709 req/s) and failed at 1,318. Candidates, in order, are in the tuning plan.
