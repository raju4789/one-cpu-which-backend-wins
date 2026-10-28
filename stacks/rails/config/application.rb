require_relative "boot"

require "rails"
# Only the frameworks this API uses: no views, mailers, jobs, storage or websockets.
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"

Bundler.require(*Rails.groups)
require_relative "../lib/busy_response"

module OneCpu
  class Application < Rails::Application
    # Rails 8.1 defaults. Among them, Rails turns on YJIT, Ruby's JIT compiler,
    # when Ruby was built with it (config.yjit, a default since 7.2).
    config.load_defaults 8.1

    # A JSON API: no cookies, sessions, flash or browser-only middleware.
    config.api_only = true

    # Load shedding (tuning change 2). Under overload, requests queue in Puma
    # before Rails sees them. A request that has already waited longer than
    # wait_timeout (measured from Nginx's X-Request-Start) gets 503 at once,
    # instead of using a thread on an answer its client has likely given up on.
    # Stale work is cleared fast, so the queue drains and the server recovers.
    # service_timeout: the usual 15 s backstop for a request that runs too long;
    # requests here take milliseconds once they start, so it should never fire.
    # service_past_wait: keep the full 15 s. By default rack-timeout cuts it to
    # what's left of wait_timeout, so a request that queued 0.9 s would be
    # interrupted after 0.1 s of work, mid-request.
    # wait_overtime 0: no extra waiting allowance for requests with a body.
    config.middleware.insert_before Rack::Runtime, BusyResponse,
                                    errors: [Rack::Timeout::Error, Rack::Timeout::RequestTimeoutException]
    config.middleware.insert_after BusyResponse, Rack::Timeout,
                                   wait_timeout: Float(ENV.fetch("RACK_TIMEOUT_WAIT_TIMEOUT", 1)),
                                   service_timeout: Float(ENV.fetch("RACK_TIMEOUT_SERVICE_TIMEOUT", 15)),
                                   service_past_wait: true,
                                   wait_overtime: 0

    # "app": cache GET /feed in memory for 1 s. Anything else: never cache. Set by the harness per phase.
    config.x.feed_cache = ENV["FEED_CACHE"] == "app"
    config.x.feed_cache_ttl = 1.0
  end
end
