class Post < ApplicationRecord
  FEED_SIZE = 20
  MAX_BODY = 280

  # Required by default: saving a post first checks the user exists, which
  # also loads the author for the response.
  belongs_to :user

  validates :body, presence: true, length: { maximum: MAX_BODY }

  # Latest 20 posts with their authors, in one SQL query: eager_load joins
  # users in the same statement (includes would run a second query).
  scope :feed, -> { eager_load(:user).order(created_at: :desc, id: :desc).limit(FEED_SIZE) }

  def as_api_json
    {
      id: id,
      body: body,
      like_count: like_count,
      created_at: created_at, # ISO 8601 in UTC, e.g. 2026-10-27T18:00:00.123Z
      author: { id: user.id, username: user.username, display_name: user.display_name }
    }
  end
end
