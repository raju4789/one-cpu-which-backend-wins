# Lessons learned

What went wrong while benchmarking, how each problem was found, and what it teaches about load testing in general. Written as we go, so the reasoning is captured while it's fresh. Problems are in the order we hit them.

Most of these were not bugs in the stack under test. They were the test setup lying about the stack. That's the main lesson: **a load test measures the whole system, including the machine generating the load, and you have to prove every run that the server was the limit.**

## The Node stack, no-cache phase

### 1. The app container exited: "permission denied" on package.json

**Symptom.** The Node container exited at start. Nginx then exited too, because its upstream was gone.

**How we found it.** `docker logs` on the app container: `Cannot read package config /app/package.json: permission denied`.

**Cause.** Files written to the Mac had mode 600 (readable by the owner only). Docker's `COPY` keeps file permissions, and the image runs as the unprivileged `node` user, not root, so it couldn't read its own files.

**Fix.** `chmod -R a+rX` on the app files in the build stage of the Dockerfile.

**Lesson.** Running as a non-root user is right, but test the image the way it runs in production. Host file permissions leak into images.

### 2. The runner crashed, and k6 couldn't connect, at about 6,700 connections

**Symptom.** The first full run crashed after 6 steps: the runner's query to Prometheus timed out. The k6 log showed 3,475 `dial: i/o timeout` errors starting at the same second. Node was at 39% CPU and answering in 13 ms.

**How we found it.**

1. The error type: every failure was `dial: i/o timeout`, meaning a new TCP connection got no answer at all. Not a slow response, not an error from the server.
2. The timeline: k6 (talking to the bench VM) and the runner (talking to the monitor VM) failed in the same second. Two separate VMs failing together points to what they share: the Mac's networking.
3. What kept working: k6's metric pushes to Prometheus, which reuse one connection that was already open. So open connections were fine, and only new ones failed.
4. Grafana's Nginx connections panel: open connections climbed steadily from 3,155 to 6,695, step after step.
5. Comparison: the dummy-app run never went above about 2,700 connections and never failed.

**Cause.** Two things combined.

- k6 created one pool of 10,000 virtual users for the highest rate in the ramp, and hands idle users out in turn. At low rates, each user's turn came back after more than a minute. Nginx closes idle connections after 65 seconds, so every session opened a new connection, and the old ones stayed open until Nginx closed them. They piled up.
- macOS's firewall (pf) is switched on by the VMs' network and tracks every connection to them, including ones closed in the last 90 seconds. Its table holds 10,000 entries by default. About 6,700 open plus the recently closed ones filled it, and pf then silently dropped every new connection from any program on the Mac.

**Fix.** Raise pf's limit to 200,000 (`echo "set limit states 200000" | sudo pfctl -O -f -`, resets on reboot). Confirmed with `sudo pfctl -s info`: the `memory` counter, which counts connections pf couldn't record, stood at 210,980.

**Lessons.**

- The error type tells you where to look. `dial: i/o timeout` means the connection attempt got no answer. `connection refused` means something answered "no". A slow response means the server is struggling.
- When independent things fail at the same moment, look at what they share.
- Count connections, not just requests. Connection behaviour (keep-alive, pool sizes, idle timeouts) can break a test long before the server is busy.
- Every hop has a connection table with a limit: firewall, NAT, conntrack, file descriptors, ports. Find their counters.

### 3. A workaround that made things worse

**What happened.** Before the pf limit was confirmed, I changed k6 to use a separate, smaller pool per step, so connections would be reused and stay few. It lowered the count, but at high rates one step hit its pool cap, and once k6 stopped sending requests for about 90 seconds at a step change. Once pf was confirmed and raised, the workaround wasn't needed, so it was reverted to one pool.

**Lesson.** Find the root cause before engineering around it. A workaround for a symptom adds new failure modes. When the root cause is fixed, remove the workaround.

### 4. A run failed because Docker Hub didn't answer

**Symptom.** `bin/up` failed at `load metadata for docker.io/library/node:24.22.1-alpine` with `DeadlineExceeded`, before any load ran.

**Cause.** The runner rebuilds the image before every run. Even with everything cached, Docker checks the image tag online, and Docker Hub didn't answer in 60 seconds. Checked afterwards from the VM: it answered fine, so it was a passing blip.

**Fix.** Pin the base image by digest (`node:24.22.1-alpine@sha256:...`). Builds are reproducible and use the local copy.

**Lesson.** A benchmark run shouldn't depend on the internet. Pin everything, and make runs work offline once set up.

### 5. The Mac went to sleep in the middle of a run

**Symptom.** A confirm step was still "running" 20 minutes after it should have finished.

**How we found it.** Prometheus had no samples at all from 07:46 to 08:03, for every target, including the Mac's own metrics. Everything going silent at once means the machine itself stopped.

**Fix.** The runner keeps the Mac awake with `caffeinate` while it runs, and detects sleep anyway: if the wall clock jumps but the monotonic clock (which pauses during sleep) doesn't, the run is stopped as invalid.

**Lesson.** Long tests on a laptop need the machine kept awake, and a check that it was. Gaps in all metrics at once mean the observer paused, not the server.

### 6. A step "failed" because k6 ran out of users, and the runner guessed wrong

**Symptom.** A step failed with 5% of sessions dropped. The runner said the load generator was the limit because p95 was 275 ms, which it counted as "still fast".

**How we found it.** k6's own log said `Insufficient VUs, reached 5000 active VUs`.

**Fix.** The runner now reads that message from k6's log and stops the run as invalid when it appears while latency still passes. It no longer guesses from latency.

**Lesson.** Detect load-generator limits from the generator's own signals, not from guesses about the server.

### 7. Connections refused at the start of a test: a wrong theory, then pf's adaptive timeouts

**Symptom.** The fine ramp failed 322 connections in its first seconds, while Node answered in 16 ms. The pf table wasn't full: its `memory` counter hadn't moved.

**How we found it.**

1. Ruled out one hop at a time: the VM's conntrack table (65,536 max, nowhere near full), Nginx's listen queue inside its container (`ListenOverflows` and `ListenDrops` both 0).
2. k6's connect times: every successful connection took under 32 ms. If packets were being lost at random, some would succeed on a retry after about a second. So specific connections were refused outright, not slowed.
3. pf's `state-mismatch` counter: 5 earlier, 8,835 after the run. So pf was the one dropping them.

**The wrong theory.** I blamed reused ports: macOS reuses a closed connection's port after 30 s, while pf remembers the closed connection for up to 90 s. The fix was a 2-minute cool-down between tests. The next run failed again, worse (1,091 connections), and `state-mismatch` rose to 27,772. The theory explained the first numbers but didn't survive a test.

**The actual cause** (to confirm with the next run). `sudo pfctl -s timeouts` showed `adaptive.start 6000` and `adaptive.end 12000`. Past 6,000 tracked connections, pf shortens all its timers, and at 12,000 they reach zero, so it forgets connections still in their handshake and drops the replies. These thresholds normally sit at 60% and 120% of the state limit, but raising the limit to 200,000 didn't move them. A fresh k6 opens about 8,000 connections in seconds, on top of the previous test's closing connections, which pf keeps for up to 15 minutes (`tcp.closing 900s`). That crosses 12,000. The first run's ceiling of about 6,700 connections also sits just past 6,000.

**Fix.** Raise the adaptive thresholds with the limit: `set timeout { adaptive.start 120000, adaptive.end 240000 }`.

**Lessons.**

- Fast-or-failed with nothing in between means refusal, not overload.
- Bisect along the path, checking each hop's counters, until one moves.
- A theory that fits the data still has to survive a prediction. This one predicted that a longer pause would fix it, and it didn't. Say so, and keep looking.
- When you raise one limit, read the settings around it. Related thresholds are often derived from defaults and don't follow.

### 8. The first real result: Node's limit is a cliff

At 865 sessions/s (1,209 req/s), Node passed with p95 14 ms and 66% server CPU. At 1,297 sessions/s it failed hard: 1,595 req/s, p95 4,880 ms, 21.8% errors, 96% CPU. No gentle slope in between.

**Lesson.** On one CPU, saturation is a cliff: once requests arrive faster than they're served, the queue grows without limit and latency jumps by orders of magnitude. That's why the protocol uses coarse steps to find the cliff and fine steps to locate it.

**Still to verify** from the dashboards: why errors appear at about 5 seconds. The database statement timeout is 5 s, which would fit queries waiting behind each other, but that needs checking before it's written down as fact.

## Concepts worth knowing

**Virtual users vs requests per second.** A virtual user is k6 pretending to be one person. It mostly waits, like a person reading. Requests per second is the server's actual work. Here a session sends 1.4 requests and lasts about 4 seconds, so 577 sessions/s gave about 810 req/s with about 2,300 virtual users busy. A "users" number on its own depends on how long the pretend people pause. Compare servers on requests per second.

**Open vs closed model.** In a closed model, a fixed number of users loop, and a slow server slows them down, which hides latency (coordinated omission). In an open model, new sessions start at a fixed rate whatever the server does, so overload shows up as real latency and errors. This benchmark uses the open model.

**Invalid is not the same as failed.** A failed step means the server couldn't keep up. An invalid run means something else broke, and the numbers say nothing about the server. Mixing the two up is how benchmarks lie.

## Checklist for any load test

Before trusting a result:

1. **Is the load generator the bottleneck?** Check its CPU, memory, dropped iterations, "insufficient VUs" warnings, and connection errors, every run.
2. **Did the generator machine stay awake and undisturbed?** No sleep, no other heavy work.
3. **Are connection limits raised everywhere on the path?** Firewall state tables and the thresholds tied to them, conntrack, file descriptors, ephemeral ports, listen backlogs.
4. **Do you know which errors you got?** Dial timeout, refused, reset, timeout, or 5xx all point to different places.
5. **Are tests separated enough?** Enough cool-down for closed connections and other leftover state to clear.
6. **Is the environment pinned and offline-capable?** Image digests, no network dependency during runs.
7. **Is "invalid" kept separate from "failed"?** The runner should stop and say why, not record a failure for the server.
8. **Can you line up every source on one timeline?** Generator logs, server metrics, and the generator machine's own metrics, with timestamps.
9. **Are you counting connections as well as requests?**
10. **Did you fix the cause, or a symptom?** Remove workarounds once the cause is fixed.
