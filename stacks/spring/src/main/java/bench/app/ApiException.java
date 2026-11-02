package bench.app;

import org.springframework.http.HttpStatus;

/** Errors the API returns, with the status codes from contract/openapi.yaml. */
public class ApiException extends RuntimeException {
  private final HttpStatus status;

  ApiException(HttpStatus status, String message) {
    super(message, null, false, false); // expected errors: no stack trace needed
    this.status = status;
  }

  static ApiException badRequest(String message) { return new ApiException(HttpStatus.BAD_REQUEST, message); }
  static ApiException notFound(String message) { return new ApiException(HttpStatus.NOT_FOUND, message); }
  // Load shed (DbLimiter): the database queue is full, retry in a moment.
  static ApiException busy() { return new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "server busy, retry shortly"); }

  HttpStatus status() { return status; }
}
