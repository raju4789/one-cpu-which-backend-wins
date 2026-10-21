# Rules

These rules keep the comparison fair. A result only counts if it follows all of them.

## Locked for every stack

1. **Hardware:** one Colima VM with 1 vCPU and 2 GB RAM. Nginx, the app and Postgres all run inside it.
2. **Load generator:** k6 runs on the host, outside the VM. Prometheus and Grafana run in a separate VM.
3. **Database:** same Postgres version, config, schema, indexes and seed data.
4. **API:** every stack passes the same contract tests before it is load tested.
5. **Load:** same k6 script, ramp, think time and pass criteria.
6. **Queries:** same work per request. One query for the feed, no N+1.
7. **Logging:** production style, info level, the same for all stacks.
8. **Nginx:** one shared config with keepalive to the app.
9. **Repeatability:** a warm-up run before measuring, and every test run three times.

## Pass criteria

A load step passes when, held for at least 5 minutes:

- p95 latency < 300 ms
- p99 latency < 1 s
- error rate < 1%

The headline result is the highest sustained requests per second that still passes.

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
