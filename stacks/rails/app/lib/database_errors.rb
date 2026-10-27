# Maps a foreign key violation to the API error it means. The constraint names
# are Postgres's defaults for contract/schema.sql. Plain Ruby, unit tested.
module DatabaseErrors
  STATUS_BY_CONSTRAINT = {
    "likes_user_id_fkey" => [400, "unknown user"],
    "posts_user_id_fkey" => [400, "unknown user"],
    "likes_post_id_fkey" => [404, "post not found"]
  }.freeze

  # message: Postgres's error text, which names the violated constraint.
  # Returns [status, message], or nil for a violation the API doesn't expect.
  def self.for_foreign_key(message)
    constraint = message.to_s[/foreign key constraint "([^"]+)"/, 1]
    STATUS_BY_CONSTRAINT[constraint]
  end
end
