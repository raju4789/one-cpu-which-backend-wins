# GET /feed: the latest posts as JSON, from the 1-second cache when FEED_CACHE=app.
module Feed
  def self.json
    cache ? cache.get : build_json
  end

  def self.build_json
    { posts: Post.feed.map(&:as_api_json) }.to_json
  end

  def self.cache
    return @cache if defined?(@cache)

    @cache = if Rails.configuration.x.feed_cache
      FeedCache.new(ttl: Rails.configuration.x.feed_cache_ttl,
                    on_lookup: ->(hit) { AppMetrics.feed_cache_lookup(hit) }) { build_json }
    end
  end
end
