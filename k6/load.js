// The benchmark load. Locked: identical for every stack.
//
// Open model: k6 starts RATE user sessions per second, however slow the
// server gets. A slow server can't slow the load down, so its real latency
// shows (no coordinated omission). One session:
//
//   GET /feed, think 1 to 3 s, like a post from that feed (30%),
//   write a post (10%), think 1 to 3 s
//
// That is 1.4 requests per session on average, about 70% reads. Likes go to
// posts the user just saw, so they concentrate on the newest posts, like on
// a real feed.
//
// Modes (run by harness/bin/run, which sets these variables):
//   MODE=constant RATE=<sessions/s> DURATION=<s>   steady load, measured after SETTLE_SECONDS
//   MODE=ramp     RATES=<r1,r2,...>                 one STEP_SECONDS step per rate
//   MODE=overload RATE=<sessions/s>                 2 min at 1.5x RATE, then 2 min back at RATE
//
// Every request is tagged with "step": the step index in a ramp, "steady",
// "over" or "recover", or "settle" during the first SETTLE_SECONDS after a
// rate change. Results only use the tagged, settled parts.
import http from "k6/http";
import { sleep } from "k6";
import exec from "k6/execution";

const BASE = __ENV.BASE_URL || "http://localhost:8080";
const MODE = __ENV.MODE || "constant";
const STEP = Number(__ENV.STEP_SECONDS || 60);
const SETTLE = Number(__ENV.SETTLE_SECONDS || 10);
const MAX_VUS = Number(__ENV.MAX_VUS || 10000);
const LIKE_SHARE = 0.3;
const POST_SHARE = 0.1;
// VUs are created up front for the highest rate: creating them mid-test is
// slow enough that k6 drops sessions it can't start in time.
const SESSION_SECONDS = 7; // generous session length for VU pre-allocation (avg is about 4 s)

const RATE = Math.max(1, Math.round(Number(__ENV.RATE || 10)));
const RATES = (__ENV.RATES || "10").split(",").map((r) => Math.max(1, Math.round(Number(r))));
const OVER = Math.round(RATE * 1.5);
const PHASE_SECONDS = Number(__ENV.OVERLOAD_SECONDS || 120); // overload: length of "over" and "recover"

const preAllocate = (rate) => Math.min(MAX_VUS, Math.max(20, Math.ceil(rate * SESSION_SECONDS)));

function scenario() {
  if (MODE === "ramp") {
    const stages = [];
    for (const r of RATES) stages.push({ target: r, duration: "5s" }, { target: r, duration: `${STEP - 5}s` });
    return { executor: "ramping-arrival-rate", startRate: RATES[0], timeUnit: "1s",
      preAllocatedVUs: preAllocate(Math.max(...RATES)), maxVUs: MAX_VUS, stages, gracefulStop: "5s" };
  }
  if (MODE === "overload") {
    return { executor: "ramping-arrival-rate", startRate: RATE, timeUnit: "1s",
      preAllocatedVUs: preAllocate(OVER), maxVUs: MAX_VUS, gracefulStop: "5s",
      stages: [
        { target: OVER, duration: "5s" }, { target: OVER, duration: `${PHASE_SECONDS - 5}s` },
        { target: RATE, duration: "5s" }, { target: RATE, duration: `${PHASE_SECONDS - 5}s` },
      ] };
  }
  return { executor: "constant-arrival-rate", rate: RATE, timeUnit: "1s",
    duration: `${Number(__ENV.DURATION || 120)}s`,
    preAllocatedVUs: preAllocate(RATE), maxVUs: MAX_VUS, gracefulStop: "5s" };
}

function stepLabels() {
  if (MODE === "ramp") return RATES.map((_, i) => String(i));
  if (MODE === "overload") return ["over", "recover"];
  return ["steady"];
}

// Thresholds per step make k6's own summary report exact numbers for each step.
// They encode the pass criteria: p95 < 300 ms, p99 < 1 s, errors < 1%.
function thresholds() {
  const t = {};
  for (const s of stepLabels()) {
    t[`http_req_duration{step:${s}}`] = ["p(95)<300", "p(99)<1000"];
    t[`http_req_failed{step:${s}}`] = ["rate<0.01"];
    t[`http_reqs{step:${s}}`] = ["count>=0"];
    t[`iterations{step:${s}}`] = ["count>=0"];
    t[`iteration_duration{step:${s}}`] = ["avg>=0"];
  }
  return t;
}

export const options = {
  scenarios: { load: scenario() },
  thresholds: thresholds(),
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

function stepFor(elapsed) {
  if (MODE === "ramp") {
    const i = Math.floor(elapsed / STEP);
    return elapsed - i * STEP < SETTLE ? "settle" : String(Math.min(i, RATES.length - 1));
  }
  if (MODE === "overload") {
    if (elapsed < SETTLE) return "settle";
    if (elapsed < PHASE_SECONDS) return "over";
    if (elapsed < PHASE_SECONDS + SETTLE) return "settle";
    return "recover";
  }
  return elapsed < SETTLE ? "settle" : "steady";
}

export function setup() {
  const start = Date.now();
  console.log(`RUN_START ${start}`); // harness/bin/run aligns server metrics to this
  return { start };
}

const think = () => sleep(1 + Math.random() * 2);

export default function (data) {
  const tags = exec.vu.metrics ? exec.vu.metrics.tags : exec.vu.tags;
  tags.step = stepFor((Date.now() - data.start) / 1000);

  const user = String(1 + Math.floor(Math.random() * 50000));

  const feed = http.get(`${BASE}/feed`, { tags: { name: "GET /feed" } });
  think();

  if (Math.random() < LIKE_SHARE && feed.status === 200) {
    let posts = [];
    try { posts = feed.json("posts") || []; } catch (e) { posts = []; }
    if (posts.length > 0) {
      const id = posts[Math.floor(Math.random() * posts.length)].id;
      http.post(`${BASE}/posts/${id}/like`, null, {
        headers: { "X-User-Id": user }, responseType: "none", tags: { name: "POST /posts/:id/like" },
      });
    }
  }

  if (Math.random() < POST_SHARE) {
    http.post(`${BASE}/posts`, JSON.stringify({ body: `Load test post from user ${user} at ${Date.now()}` }), {
      headers: { "Content-Type": "application/json", "X-User-Id": user },
      responseType: "none", tags: { name: "POST /posts" },
    });
  }

  think();
}

export function handleSummary(data) {
  return __ENV.SUMMARY_FILE ? { [__ENV.SUMMARY_FILE]: JSON.stringify(data, null, 2) } : {};
}
