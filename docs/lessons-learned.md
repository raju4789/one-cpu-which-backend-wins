# Lessons learned

This is the story of getting the first stack, Node.js, through the benchmark: what went wrong, what we tried, what didn't work, what did, and what each problem teaches about load testing in general.

The short version: **almost nothing that went wrong was Node's fault.** Most problems were in the test setup itself, and each one made Node look worse than it was. A load test measures everything between the load generator and the database, including the machine sending the load. So every run has to prove the server was the limit, not something else.

## A few words used below

- **k6**: the tool that sends the load. It runs on the Mac.
- **Virtual user**: k6 pretending to be one person. It loads the feed, pauses like someone reading, maybe likes or writes a post, and leaves. Most of its time is spent waiting.
- **Session**: one visit by a virtual user. On average it sends 1.4 requests and lasts about 4 seconds.
- **Connection**: before sending a request, k6 opens a TCP connection to the server, a short handshake of three messages. With **keep-alive**, the connection stays open and later requests reuse it, like a browser does. Nginx closes a connection that has been idle for 65 seconds.
- **pf**: the firewall built into macOS. Colima turns it on for the VMs' network. It keeps a table with one entry for every connection to the VMs.
- **Bench VM**: the 1-CPU, 2 GB virtual machine running Nginx, Node and Postgres. **Monitor VM**: a separate VM running Prometheus and Grafana.

## Chapter 1: The app wouldn't start

**What we saw.** The Node container stopped immediately. Its log said: `Cannot read package config /app/package.json: permission denied`.

**Why.** The project files on the Mac could only be read by their owner. Docker copies files into the image with the same permissions. The app runs as a restricted user called `node`, not as the all-powerful root user, so it wasn't allowed to read its own files.

**What worked.** One line in the Dockerfile that makes the app's files readable by everyone (`chmod -R a+rX`).

**Lesson.** Running as a restricted user is good practice, but test the image exactly as it will run. Permissions from your laptop can sneak into the image.

## Chapter 2: The first run crashed at about 6,700 connections

**What we saw.** The first full run passed six steps and then crashed. Two things failed in the same second:

- k6 reported 3,475 errors, all `dial: i/o timeout`. That means k6 tried to open a new connection and got no answer at all.
- The runner tried to ask Prometheus for the results and also couldn't connect.

Node was fine. It was using 39% of its CPU and answering in 13 ms.

**How we narrowed it down.**

1. Two different VMs failed at the same moment. When separate things fail together, look at what they share. Here, that was the Mac's networking.
2. Connections that were already open kept working. k6's live metrics to Prometheus use one long-lived connection, and those kept arriving. Only new connections failed.
3. Grafana's Nginx panel showed open connections climbing steadily, from 3,155 to 6,695.
4. An earlier test of the dummy app never went above about 2,700 connections, and never failed.

**Why connections piled up.** k6 created 10,000 virtual users up front, enough for the highest rate in the test, and hands them out in turn. At low rates, each user waited more than a minute for its next turn. By then Nginx had closed its idle connection, so every session opened a new connection, and the count kept growing.

**What we tried first.** We made k6 build a smaller group of users for each step, so each user came back within seconds and reused its connection. That brought the number of connections down, so it looked like the fix.

**Why that wasn't the real fix.** The next run broke the same way at step 12, again at about 6,700 open connections. The same number twice meant a fixed limit somewhere.

**What we found.** `sudo pfctl -s info` and `sudo pfctl -s memory` showed that pf's connection table was limited to 10,000 entries. Its `memory` counter, which counts connections pf couldn't record because the table was full, stood at 210,980. Each of those was a connection silently dropped. Closed connections stay in the table for a while too, so about 6,700 open plus the recently closed ones filled it.

**What worked.** Raising pf's limit to 200,000. It resets when the Mac restarts, so it's now a setup step in the harness README.

**Lessons.**

- The error message tells you where to look. "No answer" (timeout), "no" (connection refused) and "slow" are three different problems in three different places.
- When independent things fail together, look at what they share.
- Count connections, not just requests. Connection limits can break a test while the server is barely busy.

## Chapter 3: A run failed because Docker Hub didn't answer

**What we saw.** A run stopped before any load, while building the Node image: `DeadlineExceeded` while checking `node:24.22.1-alpine` on Docker Hub.

**Why.** Before every run, the image is rebuilt to make sure it matches the code. Even when everything is already on the machine, Docker checks the image's name online. Docker Hub didn't answer within 60 seconds. A minute later it answered fine, so it was a passing blip.

**What worked.** Naming the base image by its exact fingerprint (a digest, `node:24.22.1-alpine@sha256:...`) instead of by name. Every build then uses exactly the same image, and Docker can use the copy it already has.

**Lesson.** A benchmark run shouldn't depend on the internet. Pin every image so runs are repeatable and work offline.

## Chapter 4: The Mac fell asleep, and k6 ran out of users

**What we saw.** The third run got much further, but something was off. A test that should take 5 minutes was still "running" 20 minutes later.

**How we found it.** Prometheus had no data at all from 07:46 to 08:03: not from the server, not from Postgres, not even from the Mac itself. When every source goes silent at once, the machine doing the observing stopped. The Mac had gone to sleep, which pauses the VMs and k6.

**Also in that run.** One step failed because k6 ran out of virtual users. k6's log said `Insufficient VUs, reached 5000 active VUs`. That was the per-step groups from Chapter 2, which were capped at 5,000 users each. In another step, k6 stopped sending anything for about 90 seconds at the change from one step to the next.

**What worked.**

- The runner now keeps the Mac awake while it runs (macOS's `caffeinate` command). If the Mac sleeps anyway, for example because the lid was closed, the runner notices and stops the run.
- Since pf's limit was fixed, the per-step groups weren't needed any more. k6 went back to one group of users for the whole test, which has no step changes to go wrong.
- When k6 says it ran out of users while the server is still fast, the runner stops the run and says to give k6 more users. Before, it guessed from the server's speed, and guessed wrong.

**Lessons.**

- Keep the test machine awake, and check that it stayed awake.
- Ask the load generator whether it kept up. Don't guess from the server's numbers.
- Once the real cause is fixed, remove the workaround. It only adds new ways to fail.

## Chapter 5: Node's first real result

**What we saw.** The fourth run got past every earlier problem, and Node hit its real limit:

| Load | Requests per second | p95 latency | Errors | Server CPU | Result |
| --- | --- | --- | --- | --- | --- |
| 865 sessions/s | 1,209 | 14 ms | 0% | 66% | Pass |
| 1,297 sessions/s | 1,595 | 4,880 ms | 21.8% | 96% | Fail |

The fifth run repeated it almost exactly: 1,211 req/s at 15 ms, then the same collapse.

**What it means.** On one CPU, the limit is a cliff, not a slope. As long as requests arrive slower than the server finishes them, latency stays low. Once they arrive faster, they queue up, the queue grows every second, and latency jumps from milliseconds to seconds. That's why the test first takes big steps to find the cliff, then small steps to find exactly where it is.

**Still to check.** The failing requests took about 5 seconds, which matches the database query timeout we set (5 s). That suggests queries waiting in line for the database, but it needs checking on the dashboards before it's a fact.

## Chapter 6: New connections refused at the start of a test

This one took two attempts to solve.

**What we saw.** Right after Node's cliff, the next test (the fine ramp) started and k6 couldn't open 322 connections in its first few seconds. Node was answering in 16 ms. pf's `memory` counter hadn't moved, so the table wasn't full.

**How we narrowed it down.**

1. We checked each place a connection passes through. The bench VM's own connection table was nowhere near full. Nginx's queue for new connections had dropped nothing.
2. Every connection that did succeed took less than 32 ms. If the network were randomly losing messages, some connections would succeed on a retry after a second or more. None did. So particular connections were refused outright.
3. pf's `state-mismatch` counter had gone from 5 to 8,835. That counts messages pf rejected because they didn't match what it expected for that connection. So pf was rejecting them.

**What we thought first.** Each new test starts a fresh k6, which opens about 8,000 new connections in a few seconds. The previous test had closed 10,000 connections 31 seconds earlier. macOS lets a closed connection's port number be reused after 30 seconds, but pf remembers closed connections for up to 90 seconds. So we thought new connections were landing on port numbers pf still linked to old connections.

**What we tried.** A 2-minute pause between tests, so pf would forget the old connections first.

**Why it didn't work.** The next run failed worse: 1,091 connections refused, and `state-mismatch` rose to 27,772. The theory explained the first numbers, but its prediction, that a longer pause would fix it, was wrong.

**What we found.** `sudo pfctl -s timeouts` listed two settings we hadn't looked at:

```
adaptive.start   6000 states
adaptive.end    12000 states
```

When pf tracks more than 6,000 connections, it starts shortening all its timers to save space. At 12,000 the timers reach zero, and pf forgets connections that are still in the middle of their handshake. When the server's reply arrives, pf no longer recognises the connection and drops it. These two numbers are normally 60% and 120% of the table limit, but raising the limit to 200,000 didn't move them.

That explains everything:

- A fresh k6 opens about 8,000 connections at once. The previous test's closing connections can stay in pf's table for up to 15 minutes (`tcp.closing 900s`). Together that's well over 12,000.
- A 2-minute pause can't clear entries that last 15 minutes, so it didn't help.
- The very first failure in Chapter 2 happened at about 6,700 connections, just past 6,000.

**What worked.** Raising both numbers in line with the limit, to 120,000 and 240,000. The command is in the harness README. The next full run had no connection failures at all, and its fine ramp started cleanly for the first time.

**Lessons.**

- If connections either work instantly or fail completely, something is refusing them. It isn't overload.
- Check each step along the path until one of them shows the problem.
- A theory that fits the data still has to survive a test. This one didn't, so we said so and kept looking.
- When you raise one limit, read the settings next to it. Related settings are often based on the old default and don't change on their own.

## Chapter 7: A passing result that looked worse than it was

**What we saw.** The first complete run confirmed 1,697 requests per second, with a p95 of 281 ms. That's a pass, but only just: the limit is 300 ms. Yet in the step just before, at the same rate, p95 was 20 ms. Something didn't add up.

**How we found it.** Instead of one number for the whole 5 minutes, we looked at p95 for every 30 seconds:

| Time into the confirm | 0:30 | 1:00 | 1:30 | 2:00 to 5:00 |
| --- | --- | --- | --- | --- |
| p95 | 665 ms | 542 ms | 325 ms | 19 to 36 ms |

Grafana's database pool panel showed 1,076 requests waiting for a database connection at the start, then none for most of the rest.

**Why.** Before the confirm, the server sits idle for 2 minutes. Then k6 starts at the full rate, 1,211 sessions per second, in the first second. Node has only 10 database connections, so most of those first requests have to wait in line. A queue forms, and with the server already near its limit, it took about 90 seconds to clear. The first 30 seconds aren't measured, but the rest of the queue was, and those slow requests dragged the p95 up. Once the queue was gone, Node handled the same rate at about 25 ms.

So the 281 ms mostly measured how Node recovers from a sudden start, not whether it can sustain the rate, which is the one question the confirm is meant to answer.

**What worked.** The confirm and overload tests now build up from 0 to their rate over 45 seconds, and those seconds aren't measured. The confirm then waits another 30 seconds and measures 5 minutes. The overload test still jumps suddenly to 1.5x, because a sudden spike is what it tests, but from a server that's already running. Every stack gets exactly the same.

**Why this isn't bending the test in Node's favour.** The load during the 5 measured minutes is unchanged. Only the start changed, to how real traffic usually behaves: it builds up, it doesn't appear from nothing. Spikes are still tested, in the overload test, where they belong.

**Lessons.**

- One number for a whole test can hide what happened during it. Look at the timeline.
- Know what each test is for, and make sure its numbers measure that and nothing else.
- A server that starts cold, or after a pause, behaves differently from one that's warmed up. Decide which one you're measuring.

## Chapter 8: Three runs that didn't agree

**What we saw.** With the setup finally stable, we ran the Node test three times, 10 minutes apart, to get a number we could trust:

| Run | Confirmed rate | Requests per second | p95 |
| --- | --- | --- | --- |
| 1 | 1,124 sessions/s | 1,573 | 13 ms |
| 2 | 1,297 sessions/s | 1,818 | 39 ms |
| 3 | 1,211 sessions/s | 1,694 | 18 ms |

All three were valid. No connection failures, the Mac's CPU stayed at or below 25%, and the CPU calibration differed by only 1% between runs. Yet the results were 14% apart.

**How we found out why.** Run 1 first tried to confirm 1,211 sessions/s, the same rate run 3 confirmed easily, and failed. Its timeline showed Node running fine for about 4.5 minutes, at 13 to 46 ms. Then one short hiccup, and about 4,800 requests were suddenly waiting for a database connection. The queue never went away. p95 stayed at over 2 seconds for the rest of the test, and the time Node spent on garbage collection (cleaning up unused memory) went up four times.

**Why.** Right at its limit, Node has no spare capacity. Normally a small hiccup creates a short queue that clears in a moment. But when thousands of requests are waiting, each one holds memory, so Node spends more time cleaning up memory, which leaves less time for real work, so the queue can't shrink. The overload has become self-sustaining: a stable state of its own, even though the load hasn't changed. Engineers call this a metastable failure. It's the same reason Node never recovered in any overload test.

So which rate a run confirms depends partly on luck: whether a hiccup happens during its 5-minute confirm. On top of that, the fine steps are about 7% apart, so the three runs landed exactly one step either side of the middle.

**What we did.** Took the median of the three, 1,694 requests per second, and report it with its range (1,573 to 1,818). And we put "don't let a hiccup snowball" first on the tuning list: instead of letting requests wait up to 5 seconds for a database connection, answer "busy" quickly when the queue is long.

**Lessons.**

- Run more than once. A single run would have given 1,573, 1,694 or 1,818, depending on which one we happened to do.
- When repeated runs disagree, find out why before averaging. Here the spread was real behaviour, not noise in the setup.
- A system at its limit can tip from "fine" into a stuck state from one small disturbance, and stay there after the disturbance is gone. Unbounded queues make this worse: every waiting request costs memory and time.

## Chapter 9: The same test, 25% more expensive, because the Mac was busy

**What we tried.** The first tuning step was the shared Postgres settings: more memory for its cache, so the whole database fits, and gentler autovacuum. Then one quick run to check nothing got worse.

**What we saw.** It looked worse. At about 1,000 sessions per second, every container used about 25% more CPU than in the earlier runs, Node and Nginx included: Node 30% instead of 24%, Postgres 41% instead of 32%. The run failed one step earlier than before.

**How we found the cause.** A Postgres setting can't make Node or Nginx do more work per request. When everything gets slower by the same proportion, the processor itself was slower. Two numbers agreed. The CPU calibration took 5.75 seconds instead of the usual 5.45 to 5.52. And the Mac was busier than usual during the test, at 27 to 34% CPU instead of 14 to 24%, because a voice call with Claude and a browser were running alongside it.

The VM always gets "one CPU", but that's a thread the Mac schedules on its real cores. When the Mac is busy, macOS can run it on a slower core, or lower the clock speed. The VM still has one CPU, it just does less work per second.

**What worked.** The same quick run again, with the voice call ended and the browser closed. CPU per container went back to the earlier levels (Node 25%, Postgres 36%), and the run passed up to 1,221 sessions per second (1,709 requests per second), the same zone as before. So the Postgres settings were neutral for throughput, as the data had predicted: the feed query itself is the work, and settings don't make it smaller. We kept them as sensible production defaults.

The runner now compares every calibration with earlier runs and warns when the core was more than 3% slower than usual.

**Lessons.**

- Keep the test machine quiet. Anything else running, even a voice call, changes the result.
- When everything slows down by the same proportion, suspect the machine, not the change you just made.
- Measure the speed of the hardware on every run, and act on it, not just record it.

## Chapter 10: Teaching Node to say "busy"

**The problem.** Chapter 8 showed that at its limit, one hiccup could tip Node into a stuck state: thousands of requests waiting for a database connection, each allowed to wait up to 5 seconds. Every overload test ended the same way. Even after the load dropped back to normal, latency stayed at about 5 seconds and over a quarter of requests failed.

**What we changed.** Node now limits how many requests can use or wait for a database connection: the 10 that are using one, plus at most 100 waiting. Request number 111 doesn't join the queue. It's answered straight away with `503 Service Unavailable` and a `Retry-After: 1` header, which means "busy, try again in a second". No request waits more than 1 second for a connection any more. This is called load shedding, and it's standard practice for services that can be overloaded.

**What happened.** The same quick run with overload, before and after:

| | Before | After |
| --- | --- | --- |
| Overload, 1.5x the load | p95 5,032 ms, 26% errors | p95 94 ms, 43% errors |
| Back to normal load | p95 5,064 ms, 28% errors, never recovered | p95 59 ms, 0.98% errors, recovered |

During overload, more requests fail now, but they fail in milliseconds with a clear "busy", and everything else is answered in under 100 ms. Before, everything was slow and many requests timed out anyway. Once the load dropped, Node recovered straight away.

**The honest trade-off.** Requests that are turned away count as errors. At the highest passing step, 0.69% of requests got a 503: under the 1% limit, but real. And the run passed one step higher than before (+8%), but steps are 8% apart and runs vary more than that, so that gain only counts if the full runs confirm it.

**Lessons.**

- An unbounded queue turns a short overload into a long outage. Bound every queue.
- Failing fast is kinder than failing slowly: a quick "busy" lets a client retry, a 5-second timeout just wastes everyone's time.
- Judge a change on what it's meant to fix. This one was about stability, so the overload test is what decides it.

## Chapter 11: Tuning Node, and knowing when to stop

After load shedding (chapter 10), we followed the data instead of the list of ideas, one change at a time, each judged by a quick run.

**What the database was busy with.** Postgres's own statistics (`pg_stat_statements`) showed the feed query was 96% of its query time: 508 of 528 seconds. Likes and new posts together were about 20 seconds. So the planned "likes in one SQL statement" was skipped: even making likes free would barely matter.

**Two ideas for the feed query, measured before building anything.** With `pgbench`, Postgres's benchmark tool, running each version thousands of times:

| Version of the feed query | Time per query |
| --- | --- |
| As Prisma writes it (a `LATERAL JOIN` that builds the author as JSON) | 0.238 ms |
| Hand-written plain `JOIN` | 0.228 ms (4% less) |
| Prisma's, as a named prepared statement | 0.197 ms (17% less) |

The hand-written query wasn't worth giving up the ORM for 4%. Prepared statements were: without a name, Postgres parses and plans every query from scratch; with one, it does that once per connection and reuses the plan.

**What each change did in a quick run:**

| Change | Result | Kept? |
| --- | --- | --- |
| Prepared statements | Postgres 8 to 12% less CPU at every step; passing rate unchanged | Yes: less work, and the default in the other stacks' database drivers |
| Load-shedding queue 100 → 300 | Same step passed with fewer requests turned away (0.30% instead of 0.69%); clean recovery | Yes |
| Connection pool 10 → 4 | Postgres no cheaper, Node busier, requests waited longer | No, back to 10 |

**Why we stopped.** The tuning plan's rule: stop when changes stop paying. The last two were under the 10% bar. Most of the core now goes to work any stack must do: Postgres running the feed query and Nginx. And the original "reach 85 to 90% of what Postgres alone can do" turned out to be impossible: Node itself needs a third of the same core. We replaced it with a fairer measure, how the core is split at the limit, for every stack.

**What tuning bought, in quick runs.** One step more, about +8% (1,221 to 1,318 sessions per second), which the full runs still have to confirm. The bigger change was stability: from never recovering after overload to recovering with no errors.

**Lessons.**

- Measure where the time goes before choosing what to tune. The obvious idea (likes) would have been wasted work.
- Test an idea in isolation first when you can. `pgbench` settled two candidates in a minute each, before writing any code.
- Rules of thumb are a starting point, not a result. "2 to 3 connections per core" made things worse here.
- Decide in advance when to stop, or tuning never ends and the stack you spend the longest on wins.

## Chapter 12: The first cache runs, and a load generator that ran out of memory

**The app cache worked.** With Node keeping the feed in memory for one second, a quick run passed 2,808 sessions per second (3,926 requests per second), about twice the no-cache limit. The work moved: Postgres dropped to about 17% of the core, and Node became the busiest part at about 42%, since it now serves almost every request itself.

**The Nginx cache run collapsed.** Its first step, 5,000 sessions per second, served only 360 requests per second, with requests taking 41 seconds and timing out.

**How we found out why.** Two numbers didn't fit. Nginx's own counter showed it handling up to 6,700 requests per second, yet k6 recorded 360. And the Mac's CPU, normally about 20%, jumped to 63%. The Mac's memory explained both: free memory fell from 5.5 GB to 0.1 GB, and macOS compressed an extra 5.3 GB to make room. After k6 exited, 9 GB came back. k6 had been given 40,000 virtual users, about 250 KB each, roughly 10 GB. Compressing memory costs CPU, so k6 slowed itself down, and its timeouts were partly its own.

The server had a problem too. k6 hands out its users in turn, so the first pass opened a new connection for each one: 40,000 open connections within 30 seconds, and Nginx spent the core and 880 MB of memory just holding them.

**What we changed.** The cache phases get at most 25,000 virtual users, about what 5,000 sessions per second needs (each session lasts about 4 seconds), roughly 6.5 GB. If a phase needs more, the runner stops it as limited by the load generator instead of recording a result. And the runner now watches the Mac's memory: if macOS compresses more than 2 GB extra during a run, it warns that k6 may have slowed itself down.

**The rerun.** Capped at 25,000 virtual users and starting at 3,200 sessions per second, the Nginx run failed its first step with 2.6% errors, and the Mac still compressed 2.6 GB extra. It looked as if Nginx caching barely beat the app cache. Then a gentler run, capped at 16,000 and starting at 2,400, climbed cleanly: it passed 3,526 sessions per second (4,931 requests per second) and failed at 3,808, with only 0.4 GB of extra compression on the Mac. So the Nginx cache beats the app cache by roughly 25%. The 3,200 failure had come from a cold start that was too big for the Mac, not from the server's limit. With the Nginx cache, Node handles only the writes, and at the same load it used 35% of the core instead of 42%. That shows serving the feed from Node's memory wasn't free, but the writes are the main cost.

**Lessons.**

- The load generator needs resources in proportion to the load. Ten thousand times a small number is a big number.
- Don't trust a run that starts cold at a high rate. Build up to it, or the start itself becomes the test.
- When the server says it served far more than the client says it received, suspect the client.
- Check the load generator's memory as well as its CPU. Memory pressure shows up as CPU first.

## Chapter 13: The overnight batch, and a check that blamed the wrong moment

**The plan.** Twelve full runs overnight: four configurations (untuned, tuned, app cache, Nginx cache), three runs each, interleaved so slow drift on the Mac hit every configuration alike.

**What we saw.** Six of the twelve runs ended "aborted: k6 ran out of virtual users". All six had already passed their 5-minute confirm. They all stopped in the overload test that comes after it.

**Why.** The overload test pushes 1.5 times the confirmed rate for 2 minutes, then drops back to the confirmed rate for 2 minutes to see if the server recovers. During the 1.5x part, running short of virtual users is expected: the server is overloaded on purpose, sessions take longer, and more of them are open at once. k6 prints "Insufficient VUs" only once per test, at the moment it first happens. The runner saw that warning and judged it against the recovery part, where it would mean k6 couldn't send the load. So it threw out valid runs. The bug was in our check, not in the server or the Mac.

**What we changed.** The virtual-user check now only counts warnings inside the time window being judged. For the recovery part of the overload test, the runner ignores the one-time warning and instead counts the sessions k6 actually dropped during recovery. Only if that is 1% or more, while latency looks fine, is the overload test invalid. We tested the fix with fake data for three cases: a shortage during the 1.5x part (fine), a shortage before the window (fine), a shortage inside the window (invalid).

**Rescuing the results.** The confirm numbers in those six runs were measured and checked before the overload test began, so they stand. Each run was marked complete with a note that its overload test is invalid and why. The batch script got a `--resummarize` option to rebuild the summary from the corrected files.

**The results (median of 3, requests per second).**

| Configuration | Median | Range |
| --- | --- | --- |
| Untuned, no cache | 1,698 | 1,212 to 1,817 |
| Tuned, no cache | 1,815 | 1,812 to 1,816 |
| Tuned, app cache | 4,496 | 4,089 to 4,497 |
| Tuned, Nginx cache | 4,903 | 4,901 to 4,904 |

Tuning added about 7% throughput. The bigger change is consistency: untuned ranged over 600 requests per second, tuned over 4. Untuned never recovered from overload in the two tests that ran; tuned recovered all three times. The Nginx cache beats the app cache by about 9%. The 4,089 app-cache run is suspect: the Mac compressed 3.2 GB of extra memory early in that run. All three Nginx overload tests were lost to the bug, so they need a rerun.

**Lessons.**

- A check is code too, and it can be wrong. When good runs fail a check, suspect the check before the system.
- A warning printed once tells you when something started, not how long it lasted. Judge by counters over the window you care about.
- Keep what was measured correctly. One bad phase doesn't erase a good one that came before it, as long as each phase is checked on its own.

## Chapter 14: Making results checkable, and an apostrophe that broke a script

**Why.** A sceptical reader shouldn't have to trust the runner. So every run now shows the evidence behind each check: the Mac's CPU and memory, k6's own CPU and memory, dropped sessions, failed connections, sleep and core speed. Three new checks: Nginx's request count against k6's, the database against the writes k6 was told succeeded, and a fingerprint of exactly which code ran. The batch refuses to start with uncommitted changes and commits its raw results when it ends.

**First attempt: a run that tested nothing.** The first check run started 12 minutes before the new code was committed. The runner loads its code once at the start, so it ran the old version. Only the k6 script, which is read fresh for every test, had the new counters in its last test. The Mac also compressed 2.3 to 3.7 GB of extra memory during that run, against 0.8 GB the night before: the Claude app, a JetBrains tool in the background and Cursor were taking about 5 GB. Its numbers were thrown away.

**Second attempt: a syntax error on the Mac only.** The run stopped at the environment report. A comment I had added contained an apostrophe ("the stack's image") inside a `$( ... )` block. macOS ships bash 3.2, which reads that apostrophe as the start of a quote. The newer bash I tested with doesn't, so it passed my tests and failed on the Mac. Moving the comment out fixed it.

**Third attempt: clean.** With the other apps closed and the run started from Terminal:

- Nginx counted 1,501,592 requests in the overload test, and k6 recorded 1,501,592. Every request k6 sent reached the server.
- 209,550 posts were acknowledged and 209,550 stored. 608,021 likes were acknowledged and 607,499 stored: the 522 missing are repeat likes (the same user liking the same post twice), 0.09%, as estimated. Every post's like count matched its likes.
- The Mac's compressed memory didn't grow. k6 itself peaked at 7.5 GB with 20,000 virtual users, more than the 5 GB estimated, so the Mac needs to be otherwise quiet for the cache runs.
- The highest passing step was 4,929 requests per second, in line with the night before (4,903). The morning's worse result was the busy Mac, not the server.

**Lessons.**

- Test on the machine that will run the code. An old shell or tool version on it can break what passed elsewhere.
- Check that a test run actually used the new code before reading anything into it.
- Two independent counts of the same thing are the cheapest proof that a measurement is honest.
- Measure what the load generator really uses. The estimate was 30% low.

## Ideas worth understanding

**Virtual users vs requests per second.** Requests per second is what the server actually handles, so it's the fair way to compare servers. The number of virtual users depends on how long the pretend people pause. At 577 sessions per second, k6 sent about 810 requests per second while about 2,300 virtual users were busy, most of them "reading". Make the pauses twice as long and you get twice the users for the same server work.

**Open vs closed load.** In a closed test, a fixed number of users loop. If the server slows down, they slow down too, which hides how slow the server got. In an open test, which this benchmark uses, new sessions start at a fixed rate no matter what. If the server can't keep up, it shows as real latency and errors.

**Failed vs invalid.** A failed step means the server couldn't keep up, and that's a real result. An invalid run means something else broke, the Mac, the network or k6, so the numbers say nothing about the server. The runner stops invalid runs and says why, so they never get recorded as the server failing.

## Checklist for any load test

1. **Did the load generator keep up?** Check its CPU, memory, and its own warnings about dropped sessions or too few users.
2. **Did the test machine stay awake and undisturbed?**
3. **Are connection limits raised along the whole path?** Firewall tables and the settings tied to them, plus port ranges, open-file limits and queue sizes.
4. **Do you know exactly which errors you got?** No answer, refused, reset, slow and server error all point to different places.
5. **Is there enough time between tests** for leftovers from the last one to clear?
6. **Is everything pinned**, so a run doesn't depend on the internet?
7. **Are invalid runs kept apart from failed ones?**
8. **Can you line up every source on one timeline?** The load generator's log, the server's metrics and the test machine's own metrics.
9. **Are you counting connections as well as requests?**
10. **Did you fix the cause, or only a symptom?** Remove workarounds once the cause is fixed.
11. **Does the load generator have enough memory?** Thousands of virtual users cost gigabytes. Watch for the machine compressing or swapping memory.
12. **Is the machine quiet, and was its processor at normal speed?** Measure it every run against a fixed reference, not against recent runs, which drift.
13. **Did the test build up to its rate, or start cold at it?** A cold start at a high rate tests the start, not the steady state.
14. **Does the server's own count match what the load generator recorded?** If the server says it served far more, the load generator is the problem.
15. **Do your checks look at the right time window?** A warning from one phase of a test must not fail a different phase.
16. **Does a second, independent source agree?** The server's request count against the load generator's, the database against acknowledged writes.
17. **Can someone else check the result?** Record which code ran, and commit the raw results before anyone can touch them.
