require_relative "boot"

require "rails"
# Only the frameworks this API uses: no views, mailers, jobs, storage or websockets.
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"

Bundler.require(*Rails.groups)

module OneCpu
  class Application < Rails::Application
    # Rails 8.1 defaults. Among them, Rails turns on YJIT, Ruby's JIT compiler,
    # when Ruby was built with it (config.yjit, a default since 7.2).
    config.load_defaults 8.1

    # A JSON API: no cookies, sessions, flash or browser-only middleware.
    config.api_only = true

    # "app": cache GET /feed in memory for 1 s. Anything else: never cache. Set by the harness per phase.
    config.x.feed_cache = ENV["FEED_CACHE"] == "app"
    config.x.feed_cache_ttl = 1.0
  end
end
