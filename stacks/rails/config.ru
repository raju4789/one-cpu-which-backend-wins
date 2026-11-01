require_relative "config/environment"

run Rails.application
Rails.application.load_server
# The metrics server and the boot log line start from config/puma.rb, once the
# server has started (AppServer).
