// Contract test: checks that a stack implements contract/openapi.yaml exactly.
// A stack must pass this before it is load tested. bin/run runs it first.
//
//   PHASE=none k6 run k6/contract.js
//
// PHASE tells the test how stale /feed may be: fresh in "none", up to 2.5 s
// in the cache phases ("app", "nginx"): the contract's 2 seconds, plus half a
// second for this test's own polling (every 0.2 s) and request time.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE_URL || "http://localhost:8080";
const PHASE = __ENV.PHASE || "none";
const STALE_MS = PHASE === "none" ? 0 : 2500;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+00:00)$/;

export const options = {
  scenarios: {
    contract: { executor: "per-vu-iterations", vus: 1, iterations: 1, maxDuration: "2m" },
  },
  batchPerHost: 50,
  thresholds: { checks: ["rate==1"] },
};

function json(body, userId) {
  const headers = { "Content-Type": "application/json" };
  if (userId !== undefined) headers["X-User-Id"] = String(userId);
  return { body: typeof body === "string" ? body : JSON.stringify(body), params: { headers } };
}

function createPost(userId, text) {
  const req = json({ body: text }, userId);
  return http.post(`${BASE}/posts`, req.body, req.params);
}

function like(postId, userId) {
  const headers = userId === undefined ? {} : { "X-User-Id": String(userId) };
  return http.post(`${BASE}/posts/${postId}/like`, null, { headers });
}

function isPost(p) {
  return (
    p !== null && typeof p === "object" &&
    Number.isInteger(p.id) && typeof p.body === "string" &&
    Number.isInteger(p.like_count) && typeof p.created_at === "string" &&
    ISO_UTC.test(p.created_at) &&
    p.author !== null && typeof p.author === "object" &&
    Number.isInteger(p.author.id) && typeof p.author.username === "string" &&
    typeof p.author.display_name === "string"
  );
}

function newestFirst(posts) {
  for (let i = 1; i < posts.length; i++) {
    const a = Date.parse(posts[i - 1].created_at);
    const b = Date.parse(posts[i].created_at);
    if (a < b || (a === b && posts[i - 1].id < posts[i].id)) return false;
  }
  return true;
}

// Reads /feed until predicate(posts) holds, allowing the phase's staleness.
function feedUntil(predicate) {
  const start = Date.now();
  for (;;) {
    const r = http.get(`${BASE}/feed`);
    const posts = r.status === 200 ? r.json("posts") : null;
    if (posts && predicate(posts)) return true;
    if (Date.now() - start >= STALE_MS) return false;
    sleep(0.2);
  }
}

function errorBody(r) {
  try { return typeof r.json("error") === "string"; } catch (e) { return false; }
}

export default function () {
  // Health
  const health = http.get(`${BASE}/health`);
  check(health, {
    "GET /health returns 200": (r) => r.status === 200,
    "GET /health body is {status: ok}": (r) => r.status === 200 && r.json("status") === "ok",
  });

  // Feed shape and order
  const feed = http.get(`${BASE}/feed`);
  const posts = feed.status === 200 ? feed.json("posts") : [];
  check(feed, {
    "GET /feed returns 200": (r) => r.status === 200,
    "GET /feed returns exactly 20 posts": () => Array.isArray(posts) && posts.length === 20,
    "every post has the contract fields and UTC timestamps": () => posts.length > 0 && posts.every(isPost),
    "feed is ordered newest first (created_at, then id)": () => newestFirst(posts),
  });

  // Create a post
  const text = `contract test ${Date.now()}`;
  const created = createPost(123, text);
  const post = created.status === 201 ? created.json() : null;
  check(created, {
    "POST /posts returns 201": (r) => r.status === 201,
    "POST /posts returns the post with its author": () =>
      isPost(post) && post.body === text && post.like_count === 0 && post.author.id === 123,
  });
  if (!post) return;

  check(null, {
    [`new post appears in the feed (allowed staleness ${STALE_MS} ms)`]: () =>
      feedUntil((ps) => ps.length > 0 && ps[0].id === post.id),
  });

  // Validation
  const bad = [
    ["empty body", json({ body: "" }, 1)],
    ["body over 280 characters", json({ body: "x".repeat(281) }, 1)],
    ["missing body field", json({}, 1)],
    ["malformed JSON", json("{not json", 1)],
    ["missing X-User-Id", json({ body: "hi" })],
    ["unknown user", json({ body: "hi" }, 999999)],
  ];
  for (const [name, req] of bad) {
    const r = http.post(`${BASE}/posts`, req.body, req.params);
    check(r, {
      [`POST /posts with ${name} returns 400`]: (res) => res.status === 400,
      [`POST /posts with ${name} returns an error body`]: (res) => errorBody(res),
    });
  }

  // Likes: idempotent
  check(like(post.id, 5), { "first like returns 204": (r) => r.status === 204 });
  check(like(post.id, 5), { "repeat like returns 204": (r) => r.status === 204 });
  check(null, {
    "repeat like from the same user counts once": () =>
      feedUntil((ps) => ps.some((p) => p.id === post.id && p.like_count === 1)),
  });

  check(like(999999999, 5), {
    "like on a missing post returns 404": (r) => r.status === 404,
    "like on a missing post returns an error body": (r) => errorBody(r),
  });
  check(like(post.id), { "like without X-User-Id returns 400": (r) => r.status === 400 });
  check(like(post.id, 999999), { "like from an unknown user returns 400": (r) => r.status === 400 });

  // Likes: atomic under concurrency. 50 users like at the same moment, twice.
  const target = createPost(7, `concurrency test ${Date.now()}`);
  const targetId = target.status === 201 ? target.json("id") : null;
  if (targetId === null) {
    check(null, { "could create a post for the concurrency test": () => false });
    return;
  }
  const users = Array.from({ length: 50 }, (_, i) => 1001 + i);
  const batch = users.map((u) => ["POST", `${BASE}/posts/${targetId}/like`, null, { headers: { "X-User-Id": String(u) } }]);
  const first = http.batch(batch);
  const second = http.batch(batch);
  check(null, {
    "50 concurrent likes all return 204": () => first.every((r) => r.status === 204),
    "50 concurrent repeat likes all return 204": () => second.every((r) => r.status === 204),
    "like_count is exactly 50 after concurrent likes (no lost updates)": () =>
      feedUntil((ps) => ps.some((p) => p.id === targetId && p.like_count === 50)),
  });
}
