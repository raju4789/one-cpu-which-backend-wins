package bench.app;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/** The contract's endpoints (contract/openapi.yaml). */
@RestController
public class ApiController {
  private final FeedService feed;
  private final PostService posts;
  private final LikeRepository likes;

  ApiController(FeedService feed, PostService posts, LikeRepository likes) {
    this.feed = feed;
    this.posts = posts;
    this.likes = likes;
  }

  // The app only starts once Postgres answers (Application.main), so this means ready.
  @GetMapping("/health")
  Json.Health health() {
    return new Json.Health("ok");
  }

  @GetMapping("/feed")
  ResponseEntity<String> feed() {
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(feed.json());
  }

  @PostMapping("/posts")
  ResponseEntity<Json.PostView> createPost(@RequestHeader(value = "X-User-Id", required = false) String userHeader,
                                           @RequestBody Map<String, Object> request) {
    long userId = userId(userHeader);
    Object body = request.get("body");
    if (!PostService.validBody(body)) {
      throw ApiException.badRequest("body must be a string of 1 to " + PostService.MAX_BODY + " characters");
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(posts.create(userId, (String) body));
  }

  @PostMapping("/posts/{id}/like")
  ResponseEntity<Void> like(@RequestHeader(value = "X-User-Id", required = false) String userHeader,
                            @PathVariable("id") String id) {
    long userId = userId(userHeader);
    Long postId = RequestIds.parse(id);
    if (postId == null) throw ApiException.badRequest("post id must be a positive integer");
    likes.add(postId, userId);
    return ResponseEntity.noContent().build();
  }

  // X-User-Id identifies the caller (no auth, by design of the contract).
  private static long userId(String header) {
    Long id = RequestIds.parse(header);
    if (id == null) throw ApiException.badRequest("X-User-Id must be the id of an existing user");
    return id;
  }
}
