require_relative "config/environment"

run Rails.application
Rails.application.load_server

# Only Puma loads this file, after Rails has finished starting, so these run in
# the server process only (not in rails runner or the image build's checks).
# It must be after startup: Rails turns YJIT on in its very last startup step.
AppMetrics.start_server(Integer(ENV.fetch("METRICS_PORT", 9464)))
Rails.logger.warn("booted: yjit=#{AppMetrics.yjit_enabled?} threads=#{ENV.fetch('RAILS_MAX_THREADS', 3)} " \
                  "db_pool=#{AppMetrics.pool_max} feed_cache=#{Rails.configuration.x.feed_cache} " \
                  "ruby=#{RUBY_VERSION} rails=#{Rails.version}")
