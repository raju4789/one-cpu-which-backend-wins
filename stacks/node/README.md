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
```

## How the contract rules are met

| Rule | How |
| --- | --- |
| Feed in one query | `relationLoadStrategy: "join"`: Prisma loads each post's author with a `LATERAL JOIN` in the same SQL statement. Without it, Prisma runs a second query for the authors. Verified with `pg_stat_statements`: one statement per feed request |
| Atomic, idempotent likes | One transaction: `INSERT ... ON CONFLICT DO NOTHING` on `likes` (Prisma's `createMany` with `skipDuplicates`), then `UPDATE posts SET like_count = like_count + 1` only if a row was inserted (Prisma's `increment`) |
| Unknown user is 400, missing post is 404 | No extra lookup query: the insert's foreign key violation says which reference was missing |
| Validation | Fastify JSON schemas, checked by Ajv before the handler runs |
| Errors as `{ "error": "..." }` | One error handler for everything |
| `/health` means ready | The server only starts listening after a query to Postgres succeeds |
| `FEED_CACHE=app` | The serialized feed is cached for 1 second. Concurrent requests during a reload share the same query (single flight), so expiry never causes a stampede |

## Production practices

- **One process.** One CPU means one event loop. Cluster mode or worker threads would add processes fighting over the same core.
- **Responses serialized from schemas.** Fastify uses `fast-json-stringify` with the response schema, faster than `JSON.stringify` because the shape is known.
- **Keep-alive longer than Nginx's.** Node keeps idle connections 75 s, longer than Nginx keeps its upstream connections, so Node never closes one Nginx is about to reuse.
- **Graceful shutdown.** On `SIGTERM`, stop accepting connections, finish in-flight requests, close the pool, then exit.
- **Multi-stage image.** The build stage compiles TypeScript and generates the Prisma client. The runtime stage has only production dependencies and compiled code, runs as the unprivileged `node` user, with `NODE_ENV=production`.
- **Exact versions** in `package.json` and a lockfile, so every build installs the same code.

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
| `LOG_LEVEL` | `warn` | |
| `OTEL_ENABLED` | `false` | |

## Tuning log

Every change from the defaults above is recorded here with its reason and the measurement behind it.

| Date | Change | Why | Effect |
| --- | --- | --- | --- |
| | Baseline: pool of 10, default heap, one process | Starting point | First benchmark pending |
