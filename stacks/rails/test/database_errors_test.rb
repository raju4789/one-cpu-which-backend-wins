require "minitest/autorun"
require_relative "../app/lib/database_errors"

class DatabaseErrorsTest < Minitest::Test
  def violation(constraint)
    "PG::ForeignKeyViolation: ERROR:  insert or update on table \"likes\" violates foreign key " \
      "constraint \"#{constraint}\"\nDETAIL:  Key (post_id)=(999) is not present in table \"posts\"."
  end

  def test_missing_post_is_404
    assert_equal [404, "post not found"], DatabaseErrors.for_foreign_key(violation("likes_post_id_fkey"))
  end

  def test_unknown_user_is_400
    assert_equal [400, "unknown user"], DatabaseErrors.for_foreign_key(violation("likes_user_id_fkey"))
    assert_equal [400, "unknown user"], DatabaseErrors.for_foreign_key(violation("posts_user_id_fkey"))
  end

  def test_anything_else_is_not_mapped
    assert_nil DatabaseErrors.for_foreign_key(violation("some_other_fkey"))
    assert_nil DatabaseErrors.for_foreign_key("connection refused")
  end
end
