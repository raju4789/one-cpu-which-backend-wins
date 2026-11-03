package bench.app;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {
  static final int MAX_BODY = 280;

  private final PostRepository posts;
  private final UserRepository users;

  PostService(PostRepository posts, UserRepository users) {
    this.posts = posts;
    this.users = users;
  }

  // Looks the user up first, like Rails's belongs_to check: that answers
  // "unknown user" and loads the author for the response in one query.
  @Transactional
  public Json.PostView create(long userId, String body) {
    User user = users.findById(userId).orElseThrow(() -> ApiException.badRequest("unknown user"));
    Post post = posts.save(new Post(user, body, Instant.now().truncatedTo(ChronoUnit.MICROS)));
    return Json.PostView.of(post);
  }

  /** Body rules from the contract: a string of 1 to 280 characters (code points, not UTF-16 units). */
  static boolean validBody(Object body) {
    if (!(body instanceof String s) || s.isEmpty()) return false;
    return s.codePointCount(0, s.length()) <= MAX_BODY;
  }
}
