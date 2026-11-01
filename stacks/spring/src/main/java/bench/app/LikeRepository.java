package bench.app;

import jakarta.persistence.EntityManager;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Idempotent and atomic likes, in one transaction:
 * 1. insert the like, doing nothing if this user already liked the post
 *    (INSERT ... ON CONFLICT DO NOTHING)
 * 2. only if a row was inserted, increment like_count in SQL.
 * Never read-modify-write in Java: under concurrency that loses likes. JPA has
 * no upsert, so these are native queries, as a Spring team would write them.
 * An unknown post or user fails the insert's foreign key, which says which one
 * was missing, so no lookup query is needed (DatabaseErrors).
 */
@Repository
public class LikeRepository {
  private final EntityManager em;

  LikeRepository(EntityManager em) {
    this.em = em;
  }

  @Transactional
  public void add(long postId, long userId) {
    int inserted = em.createNativeQuery(
            "INSERT INTO likes (post_id, user_id) VALUES (?1, ?2) ON CONFLICT DO NOTHING")
        .setParameter(1, postId)
        .setParameter(2, userId)
        .executeUpdate();
    if (inserted == 1) {
      em.createNativeQuery("UPDATE posts SET like_count = like_count + 1 WHERE id = ?1")
          .setParameter(1, postId)
          .executeUpdate();
    }
  }
}
