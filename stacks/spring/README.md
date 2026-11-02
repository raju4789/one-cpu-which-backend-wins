# Spring Boot stack

The contract API in Spring Boot, built the way a production team would build it, and sized for one CPU and 2 GB.

| Layer | Choice |
| --- | --- |
| Runtime | Java 25 (current LTS), Eclipse Temurin JRE |
| Web framework | Spring Boot 4.1, Spring MVC |
| Web server | Tomcat (embedded), platform threads |
| Data access | Spring Data JPA (Hibernate) with HikariCP and the Postgres JDBC driver |
| Logs | Logback to stdout, warnings and errors only |
| Metrics | Actuator with Micrometer's Prometheus registry, port 9464 |

**Status:** passes [the contract test](../../k6/README.md#contract-test) in all three phases. The untuned version is tagged `spring-untuned`.

## Why these defaults

The untuned version is what `start.spring.io` gives you with Web, Data JPA and Actuator, plus the settings every stack shares (port, keep-alive, statement timeout, warn logs). Thread pool, connection pool, heap and GC are left at their defaults:

| Setting | Default | Tuning candidate |
| --- | --- | --- |
| Request threads | Tomcat, 200 platform threads | A smaller pool (change 1), virtual threads |
| Database pool | HikariCP, 10 connections, 30 s wait | Smaller pool, shorter wait |
| Heap | The JVM's choice: 1/4 of the VM's memory | Sized for the 2 GB box |
| GC | The JVM's choice for one CPU (Serial GC) | Compared with the alternatives |
| Overload | Tomcat queues up to 8,192 connections | Cap connections, answer 503 instead of queuing |
| Open session in view | On (Spring's default) | Off |

## Layout

```
src/main/java/bench/app/
├── Application.java     entry point: DATABASE_URL to JDBC, waits for Postgres
├── ApiController.java   the endpoints
├── ErrorHandler.java    every error as { "error": "..." }
├── Post.java, User.java          JPA entities for the shared tables
├── PostRepository.java  the feed query (join fetch, one statement)
├── LikeRepository.java  atomic, idempotent likes (native SQL)
├── PostService.java     creating posts, body rules
├── FeedService.java     GET /feed's JSON, from the cache when FEED_CACHE=app
├── FeedCache.java       the 1-second cache, single flight (unit tested)
├── RequestIds.java      X-User-Id and post id parsing (unit tested)
├── DatabaseErrors.java  foreign key violation -> 400 or 404 (unit tested)
├── AppMetrics.java, RequestTiming.java   the shared app_* metrics
└── BootLog.java         one line at startup with the run's settings
src/main/resources/application.yaml   every setting, with the reason
bin/pin                  one-time: pins the build and runtime images
```

## How the contract rules are met

| Rule | How |
| --- | --- |
| Feed in one query | JPQL `join fetch p.user` with a limit of 20: Hibernate loads each author in the same SQL statement |
| Atomic, idempotent likes | One transaction: `INSERT ... ON CONFLICT DO NOTHING`, then `UPDATE posts SET like_count = like_count + 1` only if a row was inserted. JPA has no upsert, so these are native queries |
| Unknown user is 400, missing post is 404 | For likes, no lookup query: the foreign key violation names the constraint. For new posts, the user is looked up first, which also loads the author for the response (like Rails) |
| Validation | Ids must be positive integers up to 2^63 - 1. The body must be a string of 1 to 280 characters, counted as characters, not UTF-16 units |
| `/health` means ready | The app only starts after a connection to Postgres succeeds |
| `FEED_CACHE=app` | The serialized feed is cached for 1 second, single flight, so expiry never causes a stampede |

## Production practices

- **Spring Boot's defaults, unless there's a reason.** `application.yaml` says why for each change.
- **Keep-alive longer than Nginx's** (75 s), and no per-connection request limit: Tomcat closes a connection after 100 requests by default, while Puma and Node don't, so Nginx would reconnect to Spring alone.
- **Graceful shutdown.** Java is PID 1; on `SIGTERM` Tomcat stops accepting and finishes in-flight requests.
- **Waits for the database at startup** (up to 30 tries, 1 s apart).
- **Limits.** Queries are cancelled after 5 s (`statement_timeout`).
- **Prepared statements**, the Postgres JDBC driver's default after a query runs 5 times on a connection.
- **Layered image**, Spring Boot's recommended layout: dependencies in their own layer, the app on a JRE, as an unprivileged user.
- **Tests in the build.** `mvn package` runs the unit tests, so a broken image is never built. The full behaviour against Postgres is checked by the contract test.

## Observability

Metrics on `:9464/metrics`: the shared `app_http_request_duration_seconds`, `app_db_pool_connections`, `app_db_pool_max` and `app_feed_cache_requests_total`, plus Micrometer's standard JVM (`jvm_*`), GC, Tomcat thread (`tomcat_threads_*`) and Hikari (`hikaricp_*`) metrics.

## Tuning log

**Untuned baseline** (tag `spring-untuned`, 1 and 2 November 2026, two full runs, no cache). Both runs passed 1,297 sessions/s (about 1,815 req/s, p95 2 ms, no errors) with the server at 68% CPU, then crashed at 1,946 sessions/s: the VM ran out of memory and Linux killed Java (exit 137, Docker's out-of-memory flag set). So untuned Spring has no confirmed result: it doesn't slow down under overload, it takes the box down. Memory at the last steps:

| Sessions/s | Spring | Nginx | Postgres | Whole VM |
| --- | --- | --- | --- | --- |
| 865 | 337 MB | 53 MB | 464 MB | 1,433 MB |
| 1,297 | 381 MB | 54 MB | 470 MB | 1,507 MB |
| 1,946 (killed) | 632 MB | 236 MB | 467 MB | 1,630 MB |

CPU wasn't the limit; memory was, and only once Spring fell behind. Then all 200 Tomcat threads ran at once, each waiting for one of 10 database connections while holding its request and stack. The JVM's heap limit (473 MB) isn't its memory use: threads and connections sit outside the heap. Results: `results/spring/none/20261101-205835` and `20261102-072004`.

**Change 1, Tomcat threads 200 to 20: testing.** Twice the database pool, so every connection stays busy while extra requests wait in Tomcat's connection queue, which costs kilobytes per request instead of a thread. Moved ahead of virtual threads, the first change in the original plan: with virtual threads every waiting request becomes a live thread holding memory, the problem the baseline showed. Kept only if it stops the crash and holds at least the baseline's last passing rate.
