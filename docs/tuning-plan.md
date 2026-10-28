# Tuning plan

The same process for Node, Spring Boot and Rails, so the comparison stays fair. It was written before tuning started, so it can't be bent later to suit one stack.

## Status

| Stack | Tuning | Result |
| --- | --- | --- |
| Node | **Finished** 25 October 2026, tagged `node-tuned`. Final runs 26 October | Same throughput as untuned within the 10% resolution; reliable where untuned wasn't. See step 6 |
| Spring Boot | Not started | |
| Rails | Tuning started 28 October 2026 (untuned tagged `rails-untuned`) | Untuned: 1,133 req/s, no recovery after overload. See the [tuning log](../stacks/rails/README.md#tuning-log) |

**Node, in short.** Kept: load shedding (at most 10 + 300 requests using or waiting for a database connection, then 503) and named prepared statements. Dropped: a hand-written feed query (4% cheaper, not worth leaving the ORM), a connection pool of 4 (Postgres no cheaper, requests waited longer in Node). Skipped: likes in one SQL statement (likes were 2% of Postgres's time). Quick runs suggested about +8% (one step). The final full runs didn't confirm it: tuned and untuned both held 1,297 sessions/s and failed at 1,427, so any gain is under the 10% resolution. What tuning did buy is reliability: tuned reached that rate in 6 of 6 full runs and recovered from overload every time; untuned reached it in 4 of 6 and never recovered.

We stopped because the step 5 signals agreed: the last two changes each brought less than 10%, there was no obvious wasted work left (garbage collection about 3% of the core), and most of the core went to work every stack must do, Postgres running the feed query and Nginx. Not because ideas ran out: what remained was either tiny (Node's memory settings) or would make Node atypical (dropping the ORM), which isn't a fair comparison. Details: the tuning log in [`stacks/node/README.md`](../stacks/node/README.md#tuning-log) and [chapters 9 to 11 of the lessons](lessons-learned.md).

## The rule

Every change must be something a production team would really ship. No benchmark-only tricks. If you wouldn't ship it at work, it's not allowed here.

Only the stack's own code and settings change, in `stacks/<name>/`. The machine, the database data, the load test and the pass criteria stay the same for everyone.

## Step 1: Shared Postgres settings (once, for all stacks)

Postgres is configured for the machine it runs on: memory and connection settings sized for 1 CPU and 2 GB. This lives in the shared harness, not in a stack's folder, and every stack runs with it.

It goes first because it changes the environment every stack runs in. The Node baseline is rerun with it, so before-and-after numbers stay comparable.

**Done.** `shared_buffers` 512 MB (the database fits), `effective_cache_size` 1 GB, gentler autovacuum, vacuum logging. Neutral for throughput, as the data predicted: the feed query itself is the work. Kept as sensible production defaults.

## Step 2: Where the time goes (replaces the ceiling test)

**Originally:** measure what Postgres alone can do on the core, with pgbench and no app, as an upper limit, and stop tuning at 85 to 90% of it.

**Changed after tuning Node, and no longer a required step.** No stack can get near that limit, because the app needs a large share of the same core (Node used about a third). So the number couldn't serve as a stopping rule, and nothing else depends on it. What replaces it is measured in every run already, the same way for every stack: how the core is split between the app, Postgres and Nginx at the limit (per-container CPU in `result.json` and Grafana). A stack whose own share is small has little left to tune.

Two tools from this step stay, because they decided what to tune:

- **`pg_stat_statements`**: which queries take Postgres's time. For Node, the feed query was 96% of it.
- **pgbench on a single query**: test an idea in isolation before writing code, by running the query thousands of times in each form. For Node, this settled two candidates in a minute each.

## Step 3: Quick-mode baseline

One quick run of the untuned stack, after step 1. Every change is compared against this. Keep the Mac quiet: a busy Mac made one Node run look 25% worse. Compare only runs without a calibration warning, or with similar calibrations.

```sh
harness/bin/run <stack> <phase> --quick              # about 11 minutes
harness/bin/run <stack> <phase> --quick --overload   # about 19 minutes
```

Quick mode:

- Keeps the database reset, the contract test (likes counted correctly), the CPU calibration and every check that the Mac isn't the bottleneck.
- Keeps one-minute steps, so each measures 50 seconds of steady load.
- Skips the long coarse ramp. It builds up over 45 seconds to 80% of the stack's latest full result, then takes up to seven 1-minute steps, each 8% higher, and stops at the first failure. `--quick-from <sessions/s>` sets the start instead.
- Reports the highest passing step. There's no 5-minute confirm, so a quick result is only comparable with other quick results, never with full ones. Results go to a folder ending in `-quick`.
- `--overload` adds the overload test, for changes meant to improve stability.

## Step 4: One change at a time

For each candidate:

0. Pick the candidate from the data, not from the order of the list: measure where the time goes first (step 2), and test the idea in isolation if you can.
1. Make the change. Run the unit tests and the contract test.
2. Do one quick run.
3. Keep it only on a clear win: about 10% more throughput, or clearly better stability (for example, recovering after overload). Drop anything marginal.
4. Write it in the stack's tuning log: what changed, why, the numbers before and after, kept or dropped.
5. The next change builds on whatever was kept.

Full runs vary by about 14%, so a single quick run can only show big wins. That's on purpose. Small differences are proven, or not, by the full runs at the end.

## Step 5: Knowing when to stop

Stop when the signals agree:

1. **Diminishing returns.** Two sensible changes in a row each bring less than 10%.
2. **No wasted work left.** The busiest part is spending its time on work that has to happen, not on extra round trips, waiting or garbage collection.
3. **The app's own share is small.** At the limit, most of the core goes to work every stack must do (Postgres running the queries, Nginx), not to the app's overhead. (This replaced "85 to 90% of the ceiling", which no stack can reach while sharing the core.)

There's also a time limit: about one day of tuning per stack, the same for all three, so no stack wins just by getting more attention.

## Step 6: Final validation

Three full runs of the final tuned version, 10 minutes apart. Report the median with its range, next to the untuned baseline, so readers see what tuning bought.

**Rerun the untuned baseline too, in the same batch.** A before-and-after comparison is only fair if nothing else changed in between. Step 1 changed the shared Postgres settings after Node's first baseline was measured, so the untuned version gets three new full runs on the current harness. Tag the untuned and tuned code (for Node: `node-untuned`, `node-tuned`) and run both, plus the cache phases on the tuned version, with `harness/bin/batch`, interleaved, ideally overnight. Stacks tuned after the Postgres change don't need this.

**Read the result at its resolution.** The runner confirms only rates it tried, about 10% apart, so a result is a band: "held this rate, failed the next". Two configurations in the same band are equal as far as this test can tell. Report how often each run reached the band, and recovery from overload, next to the median. The stopping rule's 10% bar (step 5) matches this: a smaller gain can't be measured anyway.

**Done for Node** (`results/batches/20261026-094626`, 26 October 2026; every run passed all 11 validity checks, raw results committed unedited):

| Configuration | Runs (req/s) | Median | Highest rate held | Recovered from overload | p95 at the limit |
| --- | --- | --- | --- | --- | --- |
| Untuned, no cache | 1,694 / 1,814 / 1,815 | 1,814 | 1,297 sessions/s in 2 of 3 | 0 of 3 | 16 to 83 ms |
| Tuned, no cache | 1,815 / 1,817 / 1,817 | 1,817 | 1,297 sessions/s in 3 of 3 | 3 of 3 | 17 to 54 ms |
| Tuned, app cache | 4,906 / 4,906 / 4,495 | 4,906 | 3,503 sessions/s in 2 of 3 | 1 of 3 | 23 to 238 ms |
| Tuned, Nginx cache | 4,907 / 4,905 / 4,898 | 4,905 | 3,503 sessions/s in 3 of 3 | 3 of 3 | 17 to 28 ms |

Tuning didn't move the ceiling measurably: both versions held 1,297 sessions/s (about 1,815 req/s) and failed at 1,427. It made Node dependable: across this batch and the one before (corrected by hand, so not published), tuned reached 1,297 in 6 of 6 runs and untuned in 4 of 6, and only tuned recovered from overload. With a cache, both cache types held 3,503 sessions/s and failed at 3,795, so Nginx isn't measurably faster than the app cache. It is steadier: 6 of 6 runs at that rate against 3 of 6, much lower latency, and recovery every time. The writes (30% of requests) set the limit once reads are cached. Lessons, [chapter 15](lessons-learned.md).

## Candidates for Node, as planned, and what happened

The list as written before tuning, with the outcome. Two candidates that weren't on it came from the data.

1. **Fail fast.** *Kept, with the queue later raised from 100 to 300.* Today a request waits up to 5 seconds for a database connection, and one hiccup can snowball into an overload Node never recovers from (see [chapter 8 of the lessons](lessons-learned.md)). Instead: a short wait, then answer "busy" (503). Test with `--quick --overload`. Keep it if Node recovers without losing throughput.
2. **Likes in one SQL statement** instead of four round trips. *Skipped: likes were 2% of Postgres's query time.* Postgres is the busiest part (40 to 46% of the core). The likes-correctness check in the contract test must still pass. Look for less Postgres CPU and a higher limit.
3. **Connection pool size.** Try a couple of sizes around the current 10, guided by Grafana's pool panel. *Tried 4: dropped.*
4. **Node memory settings,** only if the dashboards show garbage collection costing real time. *Not tried: about 3% of the core.*
5. *Not on the list:* the feed as a hand-written `JOIN`. *Measured with pgbench, 4% cheaper: dropped before building.*
6. *Not on the list:* named prepared statements. *Kept: Postgres 8 to 12% less CPU.*

## Candidates for Spring Boot and Rails

Decided when we build them, with the same rule and process. Starting points already planned: for Spring Boot, the connection pool (Hikari), virtual threads and the garbage collector; for Rails, Puma workers and threads, YJIT and jemalloc.

**Rails, decided when building it.** jemalloc and YJIT moved into the baseline: Rails's generated Dockerfile installs jemalloc and Rails turns YJIT on by default (`config.load_defaults` 7.2 and later), so a production team gets both without tuning. Catawiki runs both too. Candidates, in order:

1. **Puma threads, 3 to 5.** Rails's default is 3; Catawiki runs 5. More threads help only while requests wait on Postgres; on one core they also compete for the CPU and Ruby's global lock.
2. **Puma workers.** One process by default. On one core a second process mostly competes for it, but it sidesteps Ruby's global lock, so it's measured, not assumed.
3. **GC settings** (`RUBY_GC_*`), only if the dashboards show garbage collection costing real time.
4. **Load shedding**, added after the baseline: untuned Rails never recovered from overload, the same trap as untuned Node. The production Rails pattern is the proxy stamping each request with `X-Request-Start` and the [rack-timeout](https://github.com/zombocom/rack-timeout) gem answering 503 for requests that queued too long (Heroku's router sets the header for every app).

**Tried, with one exception to "only the stack's folder changes", then reverted** (28 October 2026). Rails can't shed load without knowing how long a request queued, and that queue sits in Puma, before Rails sees the request, so only the proxy can say. So the shared Nginx config briefly sent `X-Request-Start` for one quick run. Shedding worked, but Rails still didn't recover (tuning log, change 2), so the change was dropped and the header removed: the shared harness is back to exactly what Node ran on.

**Change 1, Puma threads 3 to 5: dropped** (28 October). No throughput gain, and one step lower than 3 threads at the same core speed.

**Recovery from overload: not fixed so far.** Load shedding with rack-timeout was dropped, and a Puma queue cap was ruled out from Puma's source (tuning log). The diagnostic found the cause: Puma's listen queue overflowing, so connections retry after 1 s (tuning log). Puma workers, change 3, targeted exactly that and were dropped: 20% less throughput, and the queue still overflowed. If nothing recovers at Rails's own limit, the post says so plainly, and reports a diagnostic: whether Rails recovers when the load drops back below its limit (`bin/run --recover-at`), so readers see whether it's stuck or just slow to dig out.

## Time budget per stack

- Shared Postgres settings (once, before the first stack): about 1 hour
- Quick baseline and up to four changes: about 2 to 3 hours
- Three full runs: about 2 hours
