package bench.app;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;

import tools.jackson.databind.json.JsonMapper;

/** GET /feed's JSON, from the 1-second cache when FEED_CACHE=app. */
@Service
public class FeedService {
  static final int FEED_SIZE = 20;

  private final PostRepository posts;
  private final JsonMapper json;
  private final FeedCache cache; // null when FEED_CACHE=off

  private final DbLimiter limiter;

  FeedService(PostRepository posts, JsonMapper json, AppMetrics metrics, DbLimiter limiter,
              @Value("${FEED_CACHE:off}") String feedCache,
              @Value("${FEED_CACHE_TTL_MS:1000}") long ttlMs) {
    this.posts = posts;
    this.json = json;
    this.limiter = limiter;
    this.cache = "app".equals(feedCache)
        ? new FeedCache(TimeUnit.MILLISECONDS.toNanos(ttlMs), System::nanoTime, metrics::feedCacheLookup, this::build)
        : null;
  }

  /** The feed serialized once per load, so a cached copy is just a string. */
  String json() {
    return cache != null ? cache.get() : build();
  }

  boolean cached() {
    return cache != null;
  }

  private String build() {
    var feed = new Json.Feed(limiter.run(() -> posts.feed(Limit.of(FEED_SIZE))).stream().map(Json.PostView::of).toList());
    return json.writeValueAsString(feed);
  }
}
