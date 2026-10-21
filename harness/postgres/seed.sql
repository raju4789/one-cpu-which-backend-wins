-- Deterministic seed. Same rows every time, no random().
-- Runs once per fresh Postgres volume, into the app_template database.
--
-- users: 50,000    ids 1..50,000
-- posts: 500,000   authors spread across all users, created_at evenly from
--                  2026-01-01 to 2026-07-01 UTC, increasing with id
-- likes: 2,000,000 4 per post, unique (post, user) pairs

INSERT INTO users (id, username, display_name, created_at)
SELECT
  i,
  'user_' || i,
  'User ' || i,
  timestamptz '2025-06-01 00:00:00+00' + (i * interval '5 minutes')
FROM generate_series(1, 50000) AS i;

INSERT INTO posts (id, user_id, body, like_count, created_at)
SELECT
  i,
  ((i::bigint * 7919) % 50000) + 1,
  'Post ' || i || ': just shipped something small and it works on one CPU. Load testing is fun when the numbers are honest.',
  0,
  timestamptz '2026-01-01 00:00:00+00' + ((i - 1) * (interval '181 days' / 500000))
FROM generate_series(1, 500000) AS i;

-- Post p gets likes from users (j * 12345 + p * 31) % 50000 + 1 for j = 0..3.
-- The four offsets 0, 12345, 24690, 37035 are distinct mod 50000, so pairs are unique.
INSERT INTO likes (post_id, user_id, created_at)
SELECT
  p.id,
  ((j * 12345 + p.id * 31) % 50000) + 1,
  p.created_at + (j + 1) * interval '1 minute'
FROM posts p
CROSS JOIN generate_series(0, 3) AS j;

UPDATE posts p
SET like_count = c.n
FROM (SELECT post_id, count(*) AS n FROM likes GROUP BY post_id) c
WHERE p.id = c.post_id;

SELECT setval('users_id_seq', (SELECT max(id) FROM users));
SELECT setval('posts_id_seq', (SELECT max(id) FROM posts));
