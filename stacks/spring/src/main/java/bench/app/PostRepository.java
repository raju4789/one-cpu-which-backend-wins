package bench.app;

import java.util.List;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostRepository extends JpaRepository<Post, Long> {

  // Latest posts with their authors, in one SQL query: "join fetch" loads the
  // user in the same statement. Without it, each author would be a query (N+1).
  @Query("select p from Post p join fetch p.user order by p.createdAt desc, p.id desc")
  List<Post> feed(Limit limit);
}
