# Runs once the app is loaded (eager loading has made app/lib available).
Rails.application.config.after_initialize do
  # Time inside the app per route, compared in Grafana with k6's latency.
  ActiveSupport::Notifications.subscribe("process_action.action_controller") do |event|
    payload = event.payload
    route = payload[:request]&.route_uri_pattern.to_s.delete_suffix("(.:format)")
    status = payload[:status] || (payload[:exception] ? 500 : 0)
    AppMetrics.observe_request(method: payload[:method], route: route.empty? ? "unmatched" : route,
                               status: status, seconds: event.duration / 1000.0)
  end

  Feed.cache # built now, once, rather than by the first two requests at the same time

  # Only in the Puma process (config/puma.rb sets this), not in rails runner or the build.
  if ENV["METRICS_SERVER"] == "on"
    AppMetrics.start_server(Integer(ENV.fetch("METRICS_PORT", 9464)))
    Rails.logger.warn("booted: yjit=#{AppMetrics.yjit_enabled?} threads=#{ENV.fetch('RAILS_MAX_THREADS', 3)} " \
                      "db_pool=#{AppMetrics.pool_max} " \
                      "feed_cache=#{Rails.configuration.x.feed_cache} ruby=#{RUBY_VERSION} rails=#{Rails.version}")
  end
end
