# Runs once the server has started (config/puma.rb), after Rails's last startup
# step, which is when Rails turns YJIT on. Starts the metrics server and logs one
# boot line. With several Puma workers it runs in each, but only worker 0 serves
# metrics: the port can be bound once, so the app panels show that worker alone.
module AppServer
  def self.started(worker: nil)
    return if worker && worker != 0

    AppMetrics.start_server(Integer(ENV.fetch("METRICS_PORT", 9464)))
    Rails.logger.warn("booted: yjit=#{AppMetrics.yjit_enabled?} workers=#{ENV.fetch('WEB_CONCURRENCY', 0)} " \
                      "threads=#{ENV.fetch('RAILS_MAX_THREADS', 3)} db_pool=#{AppMetrics.pool_max} " \
                      "feed_cache=#{Rails.configuration.x.feed_cache} metrics=#{worker ? 'worker 0' : 'the process'} " \
                      "ruby=#{RUBY_VERSION} rails=#{Rails.version}")
  end
end
