# Tuning plan

The same process for Node, Spring Boot and Rails, so the comparison stays fair. It was written before tuning started, so it can't be bent later to suit one stack.

## The rule

Every change must be something a production team would really ship. No benchmark-only tricks. If you wouldn't ship it at work, it's not allowed here.

Only the stack's own code and settings change, in `stacks/<name>/`. The machine, the database data, the load test and the pass criteria stay the same for everyone.

## Step 1: Shared Postgres settings (once, for all stacks)

Postgres is configured for the machine it runs on: memory and connection settings sized for 1 CPU and 2 GB. This lives in the shared harness, not in a stack's folder, and every stack runs with it.

It goes first because it changes the ceiling (step 2) for every stack. The Node baseline is rerun with it, so before-and-after numbers stay comparable.

## Step 2: The ceiling test

Measure what Postgres alone can do on the one core, running exactly our queries (the feed read, creating a post, a like) in the same mix as the load test, with Postgres's own benchmark tool, pgbench, and no app in between.

pgbench runs from outside the bench VM, so only Postgres uses the core. Its result is the upper limit for any stack using this database.

**Correction, after tuning Node.** A stack can't get anywhere near that limit, because the app itself needs a large share of the same core (Node used about a third of it). So "reach 85 to 90% of the ceiling" was the wrong stopping rule. What's useful and fair is to report, for every stack at its limit, how the core was split between the app, Postgres and Nginx, measured the same way for all three. A stack whose own share is small has little left to tune.

## Step 3: Quick-mode baseline

One quick run of the untuned stack. Every change is compared against this.

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

## Candidates for Node, in order

1. **Fail fast.** Today a request waits up to 5 seconds for a database connection, and one hiccup can snowball into an overload Node never recovers from (see [chapter 8 of the lessons](lessons-learned.md)). Instead: a short wait, then answer "busy" (503). Test with `--quick --overload`. Keep it if Node recovers without losing throughput.
2. **Likes in one SQL statement** instead of four round trips. Postgres is the busiest part (40 to 46% of the core). The likes-correctness check in the contract test must still pass. Look for less Postgres CPU and a higher limit.
3. **Connection pool size.** Try a couple of sizes around the current 10, guided by Grafana's pool panel.
4. **Node memory settings,** only if the dashboards show garbage collection costing real time.

## Candidates for Spring Boot and Rails

Decided when we build them, with the same rule and process. Starting points already planned: for Spring Boot, the connection pool (Hikari), virtual threads and the garbage collector; for Rails, Puma workers and threads, YJIT and jemalloc.

## Time budget per stack

- Shared Postgres settings and the ceiling test (once, before the first stack): about 1 hour
- Quick baseline and up to four changes: about 2 to 3 hours
- Three full runs: about 2 hours
