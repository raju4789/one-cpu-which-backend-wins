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
end
# The metrics server and the boot log line start in config.ru, after startup.
