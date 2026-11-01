package bench.app;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Response shapes from contract/openapi.yaml. */
final class Json {
  private Json() {}

  record Author(long id, String username, @JsonProperty("display_name") String displayName) {}

  record PostView(long id, String body, @JsonProperty("like_count") int likeCount,
                  @JsonProperty("created_at") String createdAt, Author author) {
    static PostView of(Post p) {
      User u = p.getUser();
      return new PostView(p.getId(), p.getBody(), p.getLikeCount(), iso(p.getCreatedAt()),
          new Author(u.getId(), u.getUsername(), u.getDisplayName()));
    }
  }

  record Feed(List<PostView> posts) {}

  record Error(String error) {}

  record Health(String status) {}

  /** ISO 8601 in UTC with Postgres's precision (microseconds), e.g. 2026-10-27T18:00:00.123456Z. */
  static String iso(Instant t) {
    return t.truncatedTo(ChronoUnit.MICROS).toString();
  }
}
