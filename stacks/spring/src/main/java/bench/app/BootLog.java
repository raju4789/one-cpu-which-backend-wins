package bench.app;

import java.lang.management.ManagementFactory;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/** One line at startup with the settings that matter for a run, so every run's log shows them. */
@Component
public class BootLog {
  private static final Logger log = LoggerFactory.getLogger(BootLog.class);

  private final Environment env;
  private final DataSource dataSource;
  private final FeedService feed;

  BootLog(Environment env, DataSource dataSource, FeedService feed) {
    this.env = env;
    this.dataSource = dataSource;
    this.feed = feed;
  }

  @EventListener(ApplicationReadyEvent.class)
  void booted() {
    Runtime rt = Runtime.getRuntime();
    String gc = ManagementFactory.getGarbageCollectorMXBeans().stream()
        .map(b -> b.getName()).collect(Collectors.joining("+"));
    int pool = dataSource instanceof HikariDataSource h ? h.getMaximumPoolSize() : -1;
    log.warn("booted: java={} spring_boot={} cpus={} max_heap_mb={} gc={} virtual_threads={} "
            + "tomcat_max_threads={} tomcat_max_queue={} tomcat_max_connections={} db_pool={} open_in_view={} feed_cache={}",
        Runtime.version(), SpringBootVersion.getVersion(), rt.availableProcessors(), rt.maxMemory() / (1024 * 1024),
        gc, env.getProperty("spring.threads.virtual.enabled", "false"),
        env.getProperty("server.tomcat.threads.max", "200"),
        env.getProperty("server.tomcat.threads.max-queue-capacity", "unbounded"),
        env.getProperty("server.tomcat.max-connections", "8192"), pool,
        env.getProperty("spring.jpa.open-in-view", "true"), feed.cached() ? "app" : "off");
  }
}
