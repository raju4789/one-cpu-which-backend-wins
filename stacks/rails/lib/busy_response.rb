# Turns rack-timeout's errors into the contract's error format: 503 with
# { "error": "..." } and Retry-After, like Node's load shedding. Without it the
# error would escape Rails's error handling, which only wraps the app inside.
# Plain Ruby, unit tested.
class BusyResponse
  BODY = '{"error":"server busy, retry shortly"}'.freeze

  def initialize(app, errors:)
    @app = app
    @errors = errors
  end

  def call(env)
    @app.call(env)
  rescue *@errors
    [503, { "content-type" => "application/json; charset=utf-8", "retry-after" => "1" }, [BODY]]
  end
end
