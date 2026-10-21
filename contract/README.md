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

## Design decisions

1. **Global feed.** Everyone sees the same latest 20 posts, like the original video. A personalized feed is a later experiment.
2. **`like_count` on the post.** Updated on each like, so the feed never counts likes at read time.
3. **No auth.** `X-User-Id` identifies the caller. Auth would add cost that differs per stack and is not what we're measuring.
4. **Likes are idempotent.** A repeat like returns `204` and does not change the count.
