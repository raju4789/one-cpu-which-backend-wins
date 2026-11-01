package bench.app;

import java.net.URI;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

  public static void main(String[] args) throws Exception {
    // The harness gives DATABASE_URL as postgres://user:pass@host:port/db. Spring
    // needs a JDBC URL and separate credentials, so translate it before startup.
    String databaseUrl = System.getenv("DATABASE_URL");
    if (databaseUrl != null) {
      JdbcUrl jdbc = JdbcUrl.from(databaseUrl);
      System.setProperty("spring.datasource.url", jdbc.url());
      System.setProperty("spring.datasource.username", jdbc.username());
      System.setProperty("spring.datasource.password", jdbc.password());
      waitForDatabase(jdbc);
    }
    SpringApplication.run(Application.class, args);
  }

  // Only start once Postgres answers, so /health means "ready", which is what
  // bin/up waits for. Up to 30 tries, 1 s apart, like the other stacks.
  private static void waitForDatabase(JdbcUrl jdbc) throws InterruptedException, SQLException {
    int attempts = Integer.parseInt(System.getenv().getOrDefault("STARTUP_RETRIES", "30"));
    for (int attempt = 1; ; attempt++) {
      try (var ignored = DriverManager.getConnection(jdbc.url(), jdbc.username(), jdbc.password())) {
        return;
      } catch (SQLException e) {
        if (attempt >= attempts) throw e;
        System.err.println("database not ready (attempt " + attempt + "): " + e.getMessage());
        Thread.sleep(1000);
      }
    }
  }

  /** postgres://user:pass@host:port/db as a JDBC URL plus credentials. Unit tested. */
  record JdbcUrl(String url, String username, String password) {
    static JdbcUrl from(String databaseUrl) {
      URI uri = URI.create(databaseUrl);
      String[] userInfo = uri.getUserInfo() == null ? new String[] {"", ""} : uri.getUserInfo().split(":", 2);
      int port = uri.getPort() == -1 ? 5432 : uri.getPort();
      String url = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath()
          + (uri.getQuery() == null ? "" : "?" + uri.getQuery());
      return new JdbcUrl(url, userInfo[0], userInfo.length > 1 ? userInfo[1] : "");
    }
  }
}
