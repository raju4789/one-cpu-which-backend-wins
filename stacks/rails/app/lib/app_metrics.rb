require "socket"
require "prometheus/client"
require "prometheus/client/formats/text"

# Prometheus metrics on a separate port (9464), so scraping never competes with
# API traffic for a place in Nginx, a Puma thread or the API's routes. The app_*
# names are shared by every stack, so Grafana can compare them side by side.
module AppMetrics
  REGISTRY = Prometheus::Client::Registry.new

  HTTP_DURATION = REGISTRY.histogram(
    :app_http_request_duration_seconds,
    docstring: "Time spent in the app per request, from routing to response",
    labels: %i[method route status],
    buckets: [0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5]
  )
  FEED_CACHE = REGISTRY.counter(
    :app_feed_cache_requests_total,
    docstring: "GET /feed answered from the in-app cache (hit) or loaded from Postgres (miss)",
    labels: %i[result]
  )
  POOL = REGISTRY.gauge(
    :app_db_pool_connections,
    docstring: "Database connections by state: in use, idle, and requests waiting for one",
    labels: %i[state]
  )
  POOL_MAX = REGISTRY.gauge(:app_db_pool_max, docstring: "Configured maximum size of the database connection pool")

  # Ruby runtime. Read when Prometheus scrapes; GC time and count only ever grow.
  GC_COUNT = REGISTRY.gauge(:ruby_gc_count, docstring: "Garbage collections since the process started")
  # Minor collections scan only young objects and are quick; major ones scan the whole heap.
  GC_MINOR = REGISTRY.gauge(:ruby_gc_minor_count, docstring: "Minor (young objects only) garbage collections")
  GC_MAJOR = REGISTRY.gauge(:ruby_gc_major_count, docstring: "Major (whole heap) garbage collections")
  # What triggered the latest collection, sampled at each scrape: newobj (no free
  # slot for a new object), malloc (memory allocated outside the heap passed its
  # limit), and for major ones, why it went major. Picks which GC setting to tune.
  GC_LAST = REGISTRY.gauge(:ruby_gc_last_trigger, docstring: "1 for what triggered the latest collection",
                                                  labels: %i[kind by major_by])
  GC_MALLOC_LIMIT = REGISTRY.gauge(:ruby_gc_malloc_limit_bytes,
                                   docstring: "Current malloc limit: allocations beyond it trigger a minor GC")
  HEAP_PAGES = REGISTRY.gauge(:ruby_heap_pages, docstring: "Pages on the Ruby heap")
  GC_SECONDS = REGISTRY.gauge(:ruby_gc_time_seconds, docstring: "Time spent in garbage collection since the process started")
  HEAP_LIVE_SLOTS = REGISTRY.gauge(:ruby_heap_live_slots, docstring: "Live objects on the Ruby heap")
  YJIT = REGISTRY.gauge(:ruby_yjit_enabled, docstring: "1 if YJIT, Ruby's JIT compiler, is on")

  def self.observe_request(method:, route:, status:, seconds:)
    HTTP_DURATION.observe(seconds, labels: { method: method, route: route, status: status.to_s })
  end

  def self.feed_cache_lookup(hit)
    FEED_CACHE.increment(labels: { result: hit ? "hit" : "miss" })
  end

  def self.yjit_enabled?
    defined?(RubyVM::YJIT) && RubyVM::YJIT.enabled? ? true : false
  end

  # Rails 8.1 names the pool's size max_connections; older versions call it size.
  def self.pool_max
    pool = ActiveRecord::Base.connection_pool
    pool.respond_to?(:max_connections) ? pool.max_connections : pool.size
  end

  def self.collect
    pool = ActiveRecord::Base.connection_pool
    stat = pool.stat
    POOL.set(stat[:busy], labels: { state: "in_use" })
    POOL.set(stat[:idle], labels: { state: "idle" })
    POOL.set(stat[:waiting], labels: { state: "waiting" })
    POOL_MAX.set(pool_max)
    gc = GC.stat
    GC_COUNT.set(gc[:count])
    GC_SECONDS.set(gc[:time] / 1000.0)
    HEAP_LIVE_SLOTS.set(gc[:heap_live_slots])
    GC_MINOR.set(gc[:minor_gc_count])
    GC_MAJOR.set(gc[:major_gc_count])
    GC_MALLOC_LIMIT.set(gc[:malloc_increase_bytes_limit])
    HEAP_PAGES.set(gc[:heap_allocated_pages])
    last = GC.latest_gc_info
    GC_LAST.values.each_key { |labels| GC_LAST.set(0, labels: labels) }
    GC_LAST.set(1, labels: { kind: last[:major_by] ? "major" : "minor", by: last[:gc_by].to_s,
                             major_by: last[:major_by].to_s })
    YJIT.set(yjit_enabled? ? 1 : 0)
    Prometheus::Client::Formats::Text.marshal(REGISTRY)
  end

  # A minimal HTTP server for GET /metrics, one connection at a time: Prometheus
  # scrapes every 5 s, so that's plenty, and it needs nothing beyond the stdlib.
  def self.start_server(port)
    server = TCPServer.new("0.0.0.0", port)
    Thread.new do
      loop do
        client = server.accept
        begin
          request_line = client.gets.to_s
          while (line = client.gets) && line != "\r\n"; end # skip the headers
          if request_line.start_with?("GET /metrics ")
            respond(client, "200 OK", collect, "text/plain; version=0.0.4")
          else
            respond(client, "404 Not Found", "not found\n", "text/plain")
          end
        rescue StandardError => e
          Rails.logger.warn("metrics request failed: #{e.class}: #{e.message}")
        ensure
          client.close
        end
      end
    end
  end

  def self.respond(client, status, body, type)
    client.write("HTTP/1.1 #{status}\r\nContent-Type: #{type}\r\nContent-Length: #{body.bytesize}\r\n" \
                 "Connection: close\r\n\r\n#{body}")
  end
end
