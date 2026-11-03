package bench.app;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.ToIntFunction;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;

import org.springframework.stereotype.Component;

/**
 * The app_* metrics shared by every stack (contract rule 6), so Grafana can
 * compare them side by side. Micrometer names map to Prometheus names:
 * app.http.request.duration -> app_http_request_duration_seconds. JVM, Tomcat
 * and Hikari metrics come from Spring Boot Actuator under their standard names.
 */
@Component
public class AppMetrics {
  // The same buckets as the other stacks, in seconds.
  private static final Duration[] BUCKETS = {
      ms(1), Duration.ofNanos(2_500_000), ms(5), ms(10), ms(25), ms(50), ms(100), ms(250), ms(500), ms(1000), ms(2500)};

  private final MeterRegistry registry;
  private final ConcurrentMap<String, Timer> timers = new ConcurrentHashMap<>();
  private final Counter feedHit;
  private final Counter feedMiss;

  AppMetrics(MeterRegistry registry, DataSource dataSource) {
    this.registry = registry;
    String help = "GET /feed answered from the in-app cache (hit) or loaded from Postgres (miss)";
    this.feedHit = Counter.builder("app.feed.cache.requests").description(help).tag("result", "hit").register(registry);
    this.feedMiss = Counter.builder("app.feed.cache.requests").description(help).tag("result", "miss").register(registry);

    if (dataSource instanceof HikariDataSource hikari) {
      String poolHelp = "Database connections by state: in use, idle, and requests waiting for one";
      Gauge.builder("app.db.pool.connections", hikari, h -> pool(h, HikariPoolMXBean::getActiveConnections))
          .description(poolHelp).tag("state", "in_use").register(registry);
      Gauge.builder("app.db.pool.connections", hikari, h -> pool(h, HikariPoolMXBean::getIdleConnections))
          .description(poolHelp).tag("state", "idle").register(registry);
      Gauge.builder("app.db.pool.connections", hikari, h -> pool(h, HikariPoolMXBean::getThreadsAwaitingConnection))
          .description(poolHelp).tag("state", "waiting").register(registry);
      Gauge.builder("app.db.pool.max", hikari, HikariDataSource::getMaximumPoolSize)
          .description("Configured maximum size of the database connection pool").register(registry);
    }
  }

  void observeRequest(String method, String route, int status, long nanos) {
    String key = method + ' ' + route + ' ' + status;
    timers.computeIfAbsent(key, k -> Timer.builder("app.http.request.duration")
            .description("Time spent in the app per request, from routing to response")
            .tags("method", method, "route", route, "status", Integer.toString(status))
            .serviceLevelObjectives(BUCKETS)
            .register(registry))
        .record(Duration.ofNanos(nanos));
  }

  void feedCacheLookup(boolean hit) {
    (hit ? feedHit : feedMiss).increment();
  }

  // NaN until the pool has started (Hikari starts it at boot, before traffic).
  private static double pool(HikariDataSource h, ToIntFunction<HikariPoolMXBean> value) {
    HikariPoolMXBean pool = h.getHikariPoolMXBean();
    return pool == null ? Double.NaN : value.applyAsInt(pool);
  }

  private static Duration ms(long millis) {
    return Duration.ofMillis(millis);
  }
}
