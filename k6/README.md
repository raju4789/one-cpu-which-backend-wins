# k6

The load test and the contract test. Both are locked: identical for every stack.

| File | What it does |
| --- | --- |
| `contract.js` | Checks a stack implements [the contract](../contract/README.md). A stack must pass before it is load tested |
| `load.js` | The benchmark load |

You normally don't run these by hand. [`harness/bin/run`](../harness/README.md#run-the-benchmark) runs both with the right settings.

## The load

**Open model.** k6 starts a fixed number of user sessions per second, however slow the server gets. In the more common closed model (a fixed pool of looping users, as in the original video), a slow server makes the users slow down too, which hides part of the latency. That effect is called coordinated omission. With an open model, overload shows up as real latency and errors.

**One session:**

1. `GET /feed`
2. Think 1 to 3 seconds
3. Like a random post from that feed (30% of sessions)
4. Write a post (10% of sessions)
5. Think 1 to 3 seconds

That's 1.4 requests per session on average, about 70% reads. Likes go to posts the user just saw, so they concentrate on the newest posts, like on a real feed. That creates real row lock contention on `like_count`.

**Units.** Rates are sessions per second. Results also report requests per second (about 1.4x) and concurrent users: sessions per second times the average session length (Little's law).

### Virtual users vs requests per second

A **virtual user** is k6 pretending to be one person using the app. It runs one session: loads the feed, waits 1 to 3 seconds as if reading, maybe likes or writes a post, waits again, and leaves. Most of that time it is waiting, not sending anything.

**Requests per second** is what actually reaches the server. That is the server's real work, and the number to compare stacks on.

The two are linked by how long a session lasts. A session sends 1.4 requests on average and lasts about 4 seconds (two pauses of 2 seconds on average, plus the requests). So:

| New sessions per second | Requests per second | Virtual users busy at any moment |
| --- | --- | --- |
| 100 | 140 | about 400 |
| 577 | about 810 | about 2,300 |

The second row is measured, from step 11 of a Node run: 810 req/s, with Grafana showing about 2,300 busy virtual users.

So a "users" number on its own says little: the same server load can be called 400 users or 4,000 users, depending on how long the pretend people pause. That's why this benchmark sets the load in sessions per second and reports requests per second, with concurrent users only as a translation.

**How k6 runs them here.** k6 starts new sessions at a fixed rate, whether or not the server keeps up (the open model above). It creates a pool of virtual users before each step, about 7 per session per second, more than the 4 that are busy on average, so a slow moment never leaves it without a free user. k6 hands out idle users in turn. Each one keeps its own keep-alive connection to Nginx and reuses it on its next session a few seconds later, like a browser would. See Connections below for why the pool is sized per step.

## Modes

| Mode | Used for |
| --- | --- |
| `constant` | Warm-up and the 5-minute confirm |
| `ramp` | 1-minute steps, one per rate |
| `overload` | 2 minutes at 1.5x a rate, then 2 minutes back at it |

Every request is tagged with its step. The first 10 seconds after each rate change are tagged `settle` and left out of the results, so they measure steady load only.

**Connections.** Each step runs as its own scenario, with a pool of virtual users sized for that step's rate (rate x 7 s). k6 hands out idle users in turn, so each one comes back every few seconds and reuses its keep-alive connection, as a real browser does. One pool sized for the highest rate would break this: at low rates each user would wait longer than Nginx's 65-second keep-alive, so every session would open a new connection and idle ones would pile up into the thousands. That happened in the first Node run: at 6,700 open connections the Mac stopped opening new ones, to either VM.

## Contract test

`contract.js` checks, against a running stack:

- `/health`, and the feed's shape: 20 posts, newest first, all fields present, UTC timestamps
- `POST /posts` returns the created post, which then appears in the feed
- Validation: empty, too long, missing or malformed body, and missing or unknown user all return `400` with an error body
- Likes are idempotent: a repeat like returns `204` and counts once
- `404` for a missing post, `400` for a missing or unknown user
- Likes are atomic: 50 users liking one post at the same moment, twice, give exactly 50

The feed may be up to 2.5 seconds stale in the cache phases, as the contract allows. Set `PHASE` to match the running phase.

```sh
PHASE=none k6 run k6/contract.js
```
