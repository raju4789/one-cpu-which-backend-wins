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
