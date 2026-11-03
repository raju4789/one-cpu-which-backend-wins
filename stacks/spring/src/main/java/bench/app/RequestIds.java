package bench.app;

import java.util.regex.Pattern;

/**
 * Parses ids from headers and paths. Ids are bigint in Postgres, so anything
 * that isn't a positive integer up to 2^63 - 1 is the caller's mistake (400),
 * never a database error. The same rule as the Rails stack. Unit tested.
 */
final class RequestIds {
  private static final Pattern DIGITS = Pattern.compile("[1-9][0-9]{0,18}");

  private RequestIds() {}

  /** The id, or null if the value isn't a valid one. */
  static Long parse(String value) {
    if (value == null || !DIGITS.matcher(value).matches()) return null;
    try {
      return Long.parseLong(value);
    } catch (NumberFormatException e) { // 19 digits above 2^63 - 1
      return null;
    }
  }
}
