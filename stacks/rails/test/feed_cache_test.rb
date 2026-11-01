require "minitest/autorun"
require_relative "../app/lib/feed_cache"

class FeedCacheTest < Minitest::Test
  def setup
    @now = 100.0
    @loads = 0
    @lookups = []
    @cache = FeedCache.new(ttl: 1.0, clock: -> { @now }, on_lookup: ->(hit) { @lookups << hit }) do
      @loads += 1
      "feed #{@loads}"
    end
  end

  def test_loads_once_then_serves_the_copy_until_it_expires
    assert_equal "feed 1", @cache.get
    @now += 0.9
    assert_equal "feed 1", @cache.get
    @now += 0.2
    assert_equal "feed 2", @cache.get
    assert_equal [false, true, false], @lookups
  end

  def test_a_failed_load_is_not_cached
    failing = true
    cache = FeedCache.new(ttl: 1.0, clock: -> { @now }) do
      raise "db down" if failing

      "ok"
    end
    assert_raises(RuntimeError) { cache.get }
    failing = false
    assert_equal "ok", cache.get
  end

  def test_concurrent_requests_on_expiry_share_one_load
    loads = 0
    cache = FeedCache.new(ttl: 1.0) do
      loads += 1
      sleep 0.05 # a slow query, so the other threads arrive while it runs
      "feed"
    end
    results = Array.new(10) { Thread.new { cache.get } }.map(&:value)
    assert_equal ["feed"] * 10, results
    assert_equal 1, loads
  end
end
