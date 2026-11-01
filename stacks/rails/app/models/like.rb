class Like < ApplicationRecord
  self.primary_key = %i[post_id user_id]

  belongs_to :post
  belongs_to :user

  # Idempotent and atomic, in one transaction:
  # 1. insert the like, doing nothing if this user already liked the post
  #    (INSERT ... ON CONFLICT DO NOTHING)
  # 2. only if a row was inserted, increment like_count in SQL
  #    (UPDATE posts SET like_count = COALESCE(like_count, 0) + 1)
  # Never read-modify-write in Ruby: under concurrency that loses likes.
  # An unknown post or user fails the insert's foreign key, which says which
  # one was missing, so no lookup query is needed (DatabaseErrors).
  def self.add(post_id:, user_id:)
    transaction do
      inserted = insert({ post_id: post_id, user_id: user_id }, returning: %i[post_id])
      Post.update_counters(post_id, like_count: 1) if inserted.rows.any?
    end
  end
end
