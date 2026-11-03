package bench.app;

import java.util.Map;

import org.springframework.http.HttpStatus;

/**
 * Maps a foreign key violation to the API error it means. The constraint names
 * are Postgres's defaults for contract/schema.sql. Unit tested.
 */
final class DatabaseErrors {
  private static final Map<String, ApiException> BY_CONSTRAINT = Map.of(
      "likes_user_id_fkey", new ApiException(HttpStatus.BAD_REQUEST, "unknown user"),
      "posts_user_id_fkey", new ApiException(HttpStatus.BAD_REQUEST, "unknown user"),
      "likes_post_id_fkey", new ApiException(HttpStatus.NOT_FOUND, "post not found"));

  private DatabaseErrors() {}

  /** The API error for a violated constraint, or null for one the API doesn't expect. */
  static ApiException forConstraint(String constraint) {
    return constraint == null ? null : BY_CONSTRAINT.get(constraint);
  }

  /** Finds the constraint name in Postgres's error text, e.g. ... foreign key constraint "likes_post_id_fkey". */
  static String constraintIn(String message) {
    if (message == null) return null;
    String marker = "foreign key constraint \"";
    int start = message.indexOf(marker);
    if (start < 0) return null;
    start += marker.length();
    int end = message.indexOf('"', start);
    return end < 0 ? null : message.substring(start, end);
  }
}
