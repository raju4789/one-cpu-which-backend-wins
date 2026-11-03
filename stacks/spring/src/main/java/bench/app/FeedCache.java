package bench.app;

import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Consumer;
import java.util.function.LongSupplier;
import java.util.function.Supplier;

/**
 * The app-cache phase: the serialized feed is kept for ttl.
 *
 * Single flight: when the entry expires, the first thread reloads it while the
 * others wait on the lock and then get the fresh copy, instead of all of them
 * querying Postgres at once (a cache stampede). A failed load is not cached.
 * Same design as the Rails and Node caches. Unit tested.
 */
final class FeedCache {
  private record Entry(String value, long expiresAtNanos) {}

  private final long ttlNanos;
  private final LongSupplier clock;
  private final Consumer<Boolean> onLookup;
  private final Supplier<String> load;
  private final ReentrantLock lock = new ReentrantLock();
  private volatile Entry entry; // value and expiry swapped as one object

  FeedCache(long ttlNanos, LongSupplier clock, Consumer<Boolean> onLookup, Supplier<String> load) {
    this.ttlNanos = ttlNanos;
    this.clock = clock;
    this.onLookup = onLookup;
    this.load = load;
  }

  String get() {
    String value = freshValue();
    if (value != null) {
      onLookup.accept(true);
      return value;
    }
    lock.lock();
    try {
      value = freshValue(); // another thread reloaded it while we waited
      if (value != null) {
        onLookup.accept(true);
        return value;
      }
      onLookup.accept(false);
      value = load.get();
      entry = new Entry(value, clock.getAsLong() + ttlNanos);
      return value;
    } finally {
      lock.unlock();
    }
  }

  private String freshValue() {
    Entry e = entry;
    return e != null && e.expiresAtNanos() - clock.getAsLong() > 0 ? e.value() : null;
  }
}
