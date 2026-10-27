class FeedController < ApplicationController
  # The feed is serialized once per load, so a cached copy is just a string.
  def show
    render json: Feed.json
  end
end
