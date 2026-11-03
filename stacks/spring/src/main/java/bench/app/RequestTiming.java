package bench.app;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerMapping;

/**
 * Time inside the app per route, compared in Grafana with k6's latency. Routes
 * use the same labels as the other stacks: /posts/{id}/like becomes
 * /posts/:id/like, and a request no route matched is "unmatched".
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestTiming extends OncePerRequestFilter {
  private final AppMetrics metrics;

  RequestTiming(AppMetrics metrics) {
    this.metrics = metrics;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    long start = System.nanoTime();
    try {
      chain.doFilter(request, response);
    } finally {
      Object pattern = request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
      String route = pattern == null ? "unmatched" : pattern.toString().replace("{id}", ":id");
      metrics.observeRequest(request.getMethod(), route, response.getStatus(), System.nanoTime() - start);
    }
  }
}
