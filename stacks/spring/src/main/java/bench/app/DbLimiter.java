package bench.app;

import java.util.concurrent.Semaphore;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Load shedding for database work, the same rule as the Node stack: at most
 * {@code max} requests may be using or waiting for a database connection; the
 * next one is answered 503 at once instead of joining the queue.
 *
 * Without it, every request waits for one of the pool's connections. At the
 * limit the queue grows faster than it drains, and the waiting requests, and
 * the connections Nginx holds open for them, use memory until the box runs
 * out. A short queue keeps latency bounded and lets the server recover by
 * itself. Feed cache hits don't touch the database and never wait here.
 * Unit tested.
 */
@Component
public class DbLimiter {
  private final int max;
  private final Semaphore permits;

  @Autowired
  DbLimiter(@Value("${DB_POOL_SIZE:10}") int pool, @Value("${DB_MAX_QUEUE:300}") int queue) {
    this(pool + queue);
  }

  DbLimiter(int max) {
    this.max = max;
    this.permits = new Semaphore(max);
  }

  <T> T run(Supplier<T> work) {
    if (!permits.tryAcquire()) throw ApiException.busy();
    try {
      return work.get();
    } finally {
      permits.release();
    }
  }

  void execute(Runnable work) {
    run(() -> {
      work.run();
      return null;
    });
  }

  int max() { return max; }
  int inFlight() { return max - permits.availablePermits(); }
}
