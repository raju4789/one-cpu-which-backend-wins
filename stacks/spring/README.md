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

**Status:** passes [the contract test](../../k6/README.md#contract-test) in the no-cache phase; the app-cache and Nginx-cache phases are not checked yet. The untuned version is tagged `spring-untuned`.

## Why these defaults

The untuned version is what `start.spring.io` gives you with Web, Data JPA and Actuator, plus the settings every stack shares (port, keep-alive, statement timeout, warn logs). Thread pool, connection pool, heap and GC are left at their defaults:

| Setting | Default | Tuning candidate |
| --- | --- | --- |
| Request threads | Tomcat, 200 platform threads | A smaller pool (change 1), virtual threads |
| Database pool | HikariCP, 10 connections, 30 s wait | Smaller pool, shorter wait |
| Heap | The JVM's choice: 1/4 of the VM's memory | Sized for the 2 GB box |
| GC | The JVM's choice for one CPU (Serial GC) | Compared with the alternatives |
| Overload | Tomcat queues up to 8,192 connections | Cap connections, answer 503 instead of queuing |
| Open session in view | On (Spring's default) | Off: tried and dropped (change 4) |

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

**Change 1, Tomcat threads 200 to 20: kept** (quick run `20261102-084203-quick`). Passed every step up to 1,616 sessions/s (2,265 req/s, p95 46 ms, no errors), where untuned crashed at 1,946 and never reached a step between 1,297 and 1,946. At 1,746 it slowed (p95 1.1 s) at 92% CPU but stayed up: CPU is now the limit in the ramp, not memory. Java used 332 MB at 1,616 and 409 MB at 1,746, against 381 and 632 MB untuned. It still crashed in the overload test (2 minutes at 1.5x 1,616): out of memory again, so 20 threads bounded the threads' memory but not everything else. Next: the heap.

**Change 1, as planned:** Twice the database pool, so every connection stays busy while extra requests wait in Tomcat's connection queue, which costs kilobytes per request instead of a thread. Moved ahead of virtual threads, the first change in the original plan: with virtual threads every waiting request becomes a live thread holding memory, the problem the baseline showed. Kept only if it stops the crash and holds at least the baseline's last passing rate.

**Change 2, heap 256 MB: kept** (quick run `20261102-093843-quick`). The crash is gone: Spring survived 2 minutes at 1.5x 1,616 sessions/s with no errors (2,333 req/s, p95 1.6 s). Throughput unchanged: the same highest passing step, 1,616 sessions/s (2,263 req/s, p95 12 ms). It did not recover within 2 minutes back at 1x: p95 617 ms, p99 982 ms, still no errors, so requests queue and drain slowly instead of failing. Next: load shedding, so a request that can't be served in time fails fast instead of making every request behind it wait.

**Change 2, as planned:** The JVM's default heap is a quarter of the VM's memory. A heap grows towards its limit under load, and Java's memory outside the heap comes on top, so at the default Java can reach 650 MB or more next to Postgres's 500 MB in a 2 GB box. At 1,616 sessions/s Java used 332 MB in all, so 256 MB of heap should leave room for the work and bound the total. Kept if the overload test no longer crashes and throughput stays within the 10% resolution of change 1.

**Change 3, load shedding (queue cap 300): kept** (quick run `20261102-101128-quick`, boot line confirms `tomcat_max_queue=300`). Spring now recovers: back at 1x after the overload, p95 10 ms, p99 57 ms, no errors, against p95 617 ms without the cap. During the 1.5x part it shed 57% of requests and kept p95 at 306 ms for the rest. Throughput unchanged: the same highest passing step, 1,616 sessions/s (2,260 req/s). At 1,746 it now fails with 13% refused requests instead of p95 over 800 ms: failing fast, as intended.

**Change 3, as planned:** After change 2, Spring survived overload with no errors but didn't recover: requests queued and drained slowly. Node fixed the same problem with a limiter in its own code (10 using the pool plus 300 waiting, then 503). That can't work as-is in Spring: a request reaches the app's code only once one of Tomcat's 20 threads takes it, so the queue sits in Tomcat, before any filter could count it. So the cap is Tomcat's own (`server.tomcat.threads.max-queue-capacity`): at most 300 requests wait for a thread, and the next is refused at once. Tomcat closes a refused connection instead of answering, so clients see a 502 from Nginx, not a 503; for the recovery test both count the same. Kept if Spring recovers after overload and the highest passing step stays within 10% of change 2. The closer match to Node, virtual threads with Node's limiter, stays a candidate, tested as one change because virtual threads alone could bring the memory problem back.

**Change 4, open session in view off: dropped** (quick run `20261102-123335-quick`). No measurable difference: the same highest passing step, 1,616 sessions/s (2,263 req/s), p95 19 ms against 24 ms and server CPU 79% against 73% at that step, both within run-to-run noise. Recovery still passed. Not a clear win, so the default stays. Production teams often turn it off for other reasons (lazy loading outside transactions hides N+1 queries), but this API has none of that, and the rule is to keep only what the test can measure.

**Change 4, as planned:** Spring's default keeps the Hibernate session and its database connection open for the whole request, including writing the JSON. Every query here loads what the response needs inside its own transaction (the feed's `join fetch`, the author loaded with the new post), so nothing needs the session afterwards. Off, each connection goes back to the pool as soon as its transaction ends. Since change 1, CPU is the limit (93% at 1,746 sessions/s), so this is kept only if the highest passing step rises, or stays the same with lower CPU or latency, and recovery still passes. A small change: the main effect is shorter time holding the pool's connections, not much less CPU.

**Garbage collection: not worth tuning** (checked in Prometheus over quick run `20261102-123335-quick`). GC pauses used at most 1.2% of the core per minute, under 1% for most of the ramp. More telling: Spring itself used only 15 to 26% of the core while the whole server was at 87 to 100%. The rest went to Postgres, Nginx and the monitoring agents, so at the limit Spring is not where the time goes, and no Spring setting can buy much more.

**Cache phases, first quick runs** (with changes 1 to 3). Nginx cache: every step passed up to 4,761 sessions/s (6,663 req/s, p95 6 ms), and Spring recovered after the overload (`20261102-174152-quick`). App cache: passed up to 4,081 sessions/s (5,713 req/s, p95 78 ms), then crashed at 4,408, out of memory again (`20261102-172246-quick`). At that step Java grew from 397 to 504 MB and Nginx from 80 to 434 MB: thousands of connections piling up. The queue cap (change 3) limits waiting requests, not open connections, and Tomcat allows 8,192 of those.

**Change 5, Tomcat connections 8,192 to 500: testing.** Bounds what thousands of waiting connections can cost. 500 covers the 20 threads and 300 queued requests with room to spare; beyond that, connections wait in the kernel's accept queue (100) and are then refused. Kept if the app-cache phase no longer crashes and the no-cache phase holds its highest passing step and its recovery.
