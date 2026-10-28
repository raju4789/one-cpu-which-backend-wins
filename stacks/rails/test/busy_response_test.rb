require "minitest/autorun"
require_relative "../lib/busy_response"

class BusyResponseTest < Minitest::Test
  Expired = Class.new(StandardError)
  Interrupted = Class.new(Exception) # rack-timeout's thread interrupt is an Exception, not a StandardError

  def app_raising(error) = ->(_env) { raise error }

  def test_passes_normal_responses_through
    ok = [200, {}, ["hi"]]
    assert_equal ok, BusyResponse.new(->(_env) { ok }, errors: [Expired]).call({})
  end

  def test_listed_errors_become_503_with_retry_after
    [Expired, Interrupted].each do |error|
      status, headers, body = BusyResponse.new(app_raising(error), errors: [Expired, Interrupted]).call({})
      assert_equal 503, status
      assert_equal "1", headers["retry-after"]
      assert_equal '{"error":"server busy, retry shortly"}', body.join
    end
  end

  def test_other_errors_are_not_swallowed
    assert_raises(ArgumentError) { BusyResponse.new(app_raising(ArgumentError), errors: [Expired]).call({}) }
  end
end
