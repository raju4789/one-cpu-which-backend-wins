require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Code is loaded once at boot and never reloaded.
  config.enable_reloading = false
  config.eager_load = true

  # Errors leave as { "error": "..." } (ApplicationController), never as stack traces.
  config.consider_all_requests_local = false

  # Plain HTTP behind Nginx, like the other stacks. Rails's generated file turns on
  # assume_ssl and force_ssl, which would redirect every request to https.
  config.assume_ssl = false
  config.force_ssl = false

  # Logs to stdout. Benchmark rule: warnings and errors only, no per-request lines
  # (Nginx keeps the one access log). Rails logs every request at info.
  config.logger = ActiveSupport::TaggedLogging.logger($stdout)
  config.log_level = ENV.fetch("LOG_LEVEL", "warn")
  config.log_tags = [:request_id]

  # Nothing here signs or encrypts cookies or sessions, but Rails needs a secret
  # to boot. With none given, a random one per process is fine.
  config.secret_key_base = ENV["SECRET_KEY_BASE"].presence || SecureRandom.hex(64)

  config.i18n.fallbacks = true
  config.active_support.report_deprecations = false
  # The shared schema (contract/schema.sql) is never migrated or dumped by a stack.
  config.active_record.dump_schema_after_migration = false
end
