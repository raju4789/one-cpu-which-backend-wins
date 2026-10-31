# Rails 8.1's generated puma.rb, with the port the harness uses and two
# production settings explained below.
#
# Threads: Rails's default of 3 per process. Each request holds a thread until
# it is done, including while it waits on Postgres, so a few threads keep the
# core busy while others wait. 5 was tried and dropped (README, tuning log).
threads_count = ENV.fetch("RAILS_MAX_THREADS", 3)
threads threads_count, threads_count

# Workers: none, Rails's default: one process. 2 workers were tried and dropped
# (README, tuning log): about 20% less throughput, as two processes compete for
# one core, and the listen queue still overflowed. WEB_CONCURRENCY sets them.
worker_count = Integer(ENV.fetch("WEB_CONCURRENCY", 0))
workers worker_count
if worker_count.positive?
  before_worker_boot { |index| AppServer.started(worker: index) }
else
  after_booted { AppServer.started }
end

# Listen queue (tuning change 5): room for 4,096 connections waiting for Puma,
# instead of Puma's default 1,024. Under overload that queue overflowed (157,145
# times in one run) and each dropped connection retried after Linux's 1 s,
# keeping latency up. A longer queue lets them wait their turn instead. Linux
# caps it at net.core.somaxconn, which belongs to the shared VM.
bind "tcp://0.0.0.0:#{ENV.fetch("PORT", 8080)}?backlog=#{ENV.fetch("PUMA_BACKLOG", 4096)}"

# Longer than Nginx keeps idle upstream connections (60 s), so Puma never
# closes a connection Nginx is about to reuse (that race shows up as 502s).
persistent_timeout 75

pidfile ENV["PIDFILE"] if ENV["PIDFILE"]

# Only start once the database answers, so /health means "ready", which is
# what bin/up waits for. Waits up to 30 s if Postgres is a moment late.
if ENV["DATABASE_URL"]
  require "pg"
  attempts = Integer(ENV.fetch("STARTUP_RETRIES", 30))
  1.upto(attempts) do |attempt|
    PG.connect(ENV["DATABASE_URL"]).close
    break
  rescue PG::Error => e
    raise if attempt == attempts
    warn "database not ready (attempt #{attempt}): #{e.message.lines.first&.strip}"
    sleep 1
  end
end
