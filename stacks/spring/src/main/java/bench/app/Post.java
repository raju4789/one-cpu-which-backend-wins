package bench.app;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** The shared posts table (contract/schema.sql). Hibernate maps it, never creates or migrates it. */
@Entity
@Table(name = "posts")
public class Post {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  private String body;

  // Changed only by SQL (LikeRepository), never by saving this entity.
  @Column(insertable = false, updatable = false)
  private int likeCount;

  private Instant createdAt;

  protected Post() {}

  Post(User user, String body, Instant createdAt) {
    this.user = user;
    this.body = body;
    this.createdAt = createdAt;
  }

  public Long getId() { return id; }
  public User getUser() { return user; }
  public String getBody() { return body; }
  public int getLikeCount() { return likeCount; }
  public Instant getCreatedAt() { return createdAt; }
}
