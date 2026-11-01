require "minitest/autorun"
require_relative "../app/lib/request_ids"

class RequestIdsTest < Minitest::Test
  def test_positive_integers_up_to_bigint
    assert_equal 1, RequestIds.parse("1")
    assert_equal 123, RequestIds.parse("123")
    assert_equal 2**63 - 1, RequestIds.parse("9223372036854775807")
  end

  def test_everything_else_is_rejected
    [nil, "", "0", "-1", "01", "1.5", "abc", "12abc", " 5", "9223372036854775808", "1" * 20].each do |value|
      assert_nil RequestIds.parse(value), "expected #{value.inspect} to be rejected"
    end
  end
end
