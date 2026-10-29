class HealthController < ApplicationController
  # Puma only starts once Postgres answers (config/puma.rb), so this means ready.
  def show
    render json: { status: "ok" }
  end
end
