# Contract

What every stack must implement, exactly.

| File | What it defines |
| --- | --- |
| `schema.sql` | Tables and indexes. Shared by all stacks, never changed per stack. |
| `openapi.yaml` | Endpoints, request and response shapes, status codes. |

## Rules every stack follows

1. Listens on port `8080`.
2. Reads the database from `DATABASE_URL`.
3. Serves `GET /health` once it can take traffic.
4. Uses the schema as is. No extra indexes, no extra columns.
5. Caches `GET /feed` in memory for 1 second when `FEED_CACHE=app`, and never caches when `FEED_CACHE=off`.

## Design decisions

1. **Global feed.** Everyone sees the same latest 20 posts, like the original video. A personalized feed is a later experiment.
2. **`like_count` on the post.** Updated on each like, so the feed never counts likes at read time.
3. **No auth.** `X-User-Id` identifies the caller. Auth would add cost that differs per stack and is not what we're measuring.
4. **Likes are idempotent.** A repeat like returns `204` and does not change the count.
5. **Atomic like counts.** `like_count` is incremented in SQL, never read, changed and saved back in app code. Otherwise a stack could look faster by losing likes under load.
6. **Cached feed may be up to 2 seconds stale.** Both caches use a 1-second TTL, but Nginx counts expiry in whole seconds, so an entry can live up to 2 seconds (measured: 1.2 to 1.9 s). Without caching, the feed is always fresh.
7. **Timestamps.** ISO 8601 in UTC. Precision may differ per stack (milliseconds in Rails, microseconds in Java).

## Seed data

Every stack runs against the same data, produced by the harness seed script.

| Table | Rows | Rules |
| --- | --- | --- |
| `users` | 50,000 | IDs 1 to 50,000, so k6 can pick any of them for `X-User-Id` |
| `posts` | 500,000 | Authors spread across all users. `created_at` spread evenly from 2026-01-01 to 2026-07-01 UTC |
| `likes` | 2,000,000 | Unique (post, user) pairs |

1. **Deterministic.** The same script produces the same rows every time, so no stack gets an easier dataset.
2. **Consistent counts.** Each post's `like_count` equals its number of rows in `likes`.
3. **Fresh database per run.** Every test run starts from a fresh seed, so earlier runs' writes don't grow the tables.
