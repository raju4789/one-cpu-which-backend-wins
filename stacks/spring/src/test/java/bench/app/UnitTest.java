package bench.app;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/** Plain unit tests, no Spring context and no database: they run in the image build. */
class UnitTest {

  @Test
  void requestIdsAcceptPositiveBigints() {
    assertEquals(1L, RequestIds.parse("1"));
    assertEquals(Long.MAX_VALUE, RequestIds.parse("9223372036854775807"));
  }

  @Test
  void requestIdsRejectEverythingElse() {
    for (String bad : new String[] {null, "", "0", "-1", "01", "1.5", "abc", " 1", "9223372036854775808",
        "99999999999999999999"}) {
      assertNull(RequestIds.parse(bad), bad);
    }
  }

  @Test
  void databaseErrorsMapKnownConstraints() {
    String msg = "ERROR: insert or update on table \"likes\" violates foreign key constraint \"likes_post_id_fkey\"";
    assertEquals("likes_post_id_fkey", DatabaseErrors.constraintIn(msg));
    assertEquals(HttpStatus.NOT_FOUND, DatabaseErrors.forConstraint("likes_post_id_fkey").status());
    assertEquals(HttpStatus.BAD_REQUEST, DatabaseErrors.forConstraint("likes_user_id_fkey").status());
    assertNull(DatabaseErrors.forConstraint("something_else"));
    assertNull(DatabaseErrors.constraintIn("duplicate key value"));
  }

  @Test
  void bodyRules() {
    assertTrue(PostService.validBody("x"));
    assertTrue(PostService.validBody("x".repeat(280)));
    assertTrue(PostService.validBody("😀".repeat(280))); // 280 characters, 560 UTF-16 units
    assertFalse(PostService.validBody(""));
    assertFalse(PostService.validBody("x".repeat(281)));
    assertFalse(PostService.validBody(null));
    assertFalse(PostService.validBody(42));
  }

  @Test
  void jdbcUrlFromDatabaseUrl() {
    var j = Application.JdbcUrl.from("postgres://bench:bench@postgres:5432/app");
    assertEquals("jdbc:postgresql://postgres:5432/app", j.url());
    assertEquals("bench", j.username());
    assertEquals("bench", j.password());
  }

  @Test
  void feedCacheServesWithinTtlAndReloadsAfter() {
    AtomicLong now = new AtomicLong(0);
    AtomicInteger loads = new AtomicInteger();
    List<Boolean> lookups = new ArrayList<>();
    FeedCache cache = new FeedCache(1_000, now::get, lookups::add, () -> "v" + loads.incrementAndGet());
    assertEquals("v1", cache.get());
    now.set(999);
    assertEquals("v1", cache.get());
    now.set(1_000);
    assertEquals("v2", cache.get());
    assertEquals(List.of(false, true, false), lookups);
  }

  @Test
  void feedCacheDoesNotCacheFailures() {
    AtomicInteger calls = new AtomicInteger();
    FeedCache cache = new FeedCache(1_000, () -> 0, hit -> {}, () -> {
      if (calls.incrementAndGet() == 1) throw new IllegalStateException("db down");
      return "ok";
    });
    try { cache.get(); } catch (IllegalStateException expected) { }
    assertEquals("ok", cache.get());
  }

  @Test
  void feedCacheLoadsOnceUnderConcurrency() throws Exception {
    AtomicInteger loads = new AtomicInteger();
    CountDownLatch release = new CountDownLatch(1);
    FeedCache cache = new FeedCache(1_000_000_000L, System::nanoTime, hit -> {}, () -> {
      loads.incrementAndGet();
      try { release.await(); } catch (InterruptedException e) { throw new RuntimeException(e); }
      return "v";
    });
    List<Thread> threads = new ArrayList<>();
    for (int i = 0; i < 20; i++) threads.add(Thread.ofPlatform().start(cache::get));
    Thread.sleep(100);
    release.countDown();
    for (Thread t : threads) t.join();
    assertEquals(1, loads.get());
  }
}
