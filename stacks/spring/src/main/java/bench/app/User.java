package bench.app;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** The shared users table (contract/schema.sql). Read only: the API never writes users. */
@Entity
@Table(name = "users")
public class User {
  @Id
  private Long id;
  private String username;
  private String displayName;

  protected User() {}

  public Long getId() { return id; }
  public String getUsername() { return username; }
  public String getDisplayName() { return displayName; }
}
