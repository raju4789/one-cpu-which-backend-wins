package bench.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/** Every error leaves as { "error": "..." } with the contract's status code. */
@RestControllerAdvice
public class ErrorHandler {
  private static final Logger log = LoggerFactory.getLogger(ErrorHandler.class);

  @ExceptionHandler(ApiException.class)
  ResponseEntity<Json.Error> api(ApiException e) {
    return error(e.status(), e.getMessage());
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  ResponseEntity<Json.Error> unreadable() {
    return error(HttpStatus.BAD_REQUEST, "invalid JSON");
  }

  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  ResponseEntity<Json.Error> mediaType() {
    return error(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Content-Type must be application/json");
  }

  @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
  ResponseEntity<Json.Error> notFound() {
    return error(HttpStatus.NOT_FOUND, "not found");
  }

  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  ResponseEntity<Json.Error> method() {
    return error(HttpStatus.METHOD_NOT_ALLOWED, "method not allowed");
  }

  // A foreign key violation names the constraint, which says which reference
  // was missing (DatabaseErrors). Anything else is unexpected: a 500.
  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<Json.Error> integrity(DataIntegrityViolationException e) {
    ApiException mapped = DatabaseErrors.forConstraint(DatabaseErrors.constraintIn(e.getMostSpecificCause().getMessage()));
    if (mapped == null) return unexpected(e);
    return api(mapped);
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<Json.Error> unexpected(Exception e) {
    log.error("request failed: {}: {}", e.getClass().getName(), e.getMessage());
    return error(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
  }

  private static ResponseEntity<Json.Error> error(HttpStatus status, String message) {
    return ResponseEntity.status(status).body(new Json.Error(message));
  }
}
