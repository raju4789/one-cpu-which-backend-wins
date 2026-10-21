-- Shared schema for every stack. Stacks must not change it.

CREATE TABLE users (
  id           BIGSERIAL PRIMARY KEY,
  username     VARCHAR(30) NOT NULL UNIQUE,
  display_name VARCHAR(50) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id),
  body       VARCHAR(280) NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Serves GET /feed: ORDER BY created_at DESC, id DESC LIMIT 20
CREATE INDEX posts_feed_idx ON posts (created_at DESC, id DESC);

CREATE TABLE likes (
  post_id    BIGINT NOT NULL REFERENCES posts(id),
  user_id    BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
