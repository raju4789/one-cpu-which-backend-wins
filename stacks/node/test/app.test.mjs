// HTTP behaviour without a database: the service is replaced by a fake.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_URL ??= "postgres://unused/none";
process.env.LOG_LEVEL = "silent";
const { buildApp } = await import("../dist/app.js");
const { ApiError } = await import("../dist/errors.js");
const { Overloaded } = await import("../dist/limiter.js");

const created = { id: 1, body: "hi", like_count: 0, created_at: new Date("2026-01-01T00:00:00Z"),
  author: { id: 7, username: "user_7", display_name: "User 7" } };
let overloaded = false;
const fake = {
  feedJson: async () => { if (overloaded) throw new Overloaded(); return '{"posts":[]}'; },
  create: async (userId, body) => ({ ...created, body, author: { ...created.author, id: userId } }),
  like: async (postId) => { if (postId === 404) throw new ApiError(404, "post not found"); },
};
const app = buildApp(fake);
const inject = (opts) => app.inject(opts);
const json = { "content-type": "application/json" };

test("GET /health", async () => {
  const r = await inject({ url: "/health" });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.json(), { status: "ok" });
});

test("GET /feed returns the service's JSON as is", async () => {
  const r = await inject({ url: "/feed" });
  assert.equal(r.statusCode, 200);
  assert.match(r.headers["content-type"], /application\/json/);
  assert.equal(r.body, '{"posts":[]}');
});

test("POST /posts returns 201 with the contract's shape", async () => {
  const r = await inject({ method: "POST", url: "/posts", headers: { ...json, "x-user-id": "7" }, payload: { body: "hi" } });
  assert.equal(r.statusCode, 201);
  assert.deepEqual(r.json(), { id: 1, body: "hi", like_count: 0, created_at: "2026-01-01T00:00:00.000Z",
    author: { id: 7, username: "user_7", display_name: "User 7" } });
});

for (const [name, headers, payload] of [
  ["missing X-User-Id", json, { body: "hi" }],
  ["non-numeric X-User-Id", { ...json, "x-user-id": "abc" }, { body: "hi" }],
  ["X-User-Id beyond 2^53", { ...json, "x-user-id": "99999999999999999999" }, { body: "hi" }],
  ["empty body", { ...json, "x-user-id": "7" }, { body: "" }],
  ["body over 280 characters", { ...json, "x-user-id": "7" }, { body: "x".repeat(281) }],
  ["malformed JSON", { ...json, "x-user-id": "7" }, "{not json"],
]) {
  test(`POST /posts with ${name} is a 400 with an error body`, async () => {
    const r = await inject({ method: "POST", url: "/posts", headers, payload });
    assert.equal(r.statusCode, 400);
    assert.equal(typeof r.json().error, "string");
  });
}

test("POST /posts/:id/like returns 204, or the service's 404", async () => {
  const ok = await inject({ method: "POST", url: "/posts/5/like", headers: { "x-user-id": "7" } });
  assert.equal(ok.statusCode, 204);
  const missing = await inject({ method: "POST", url: "/posts/404/like", headers: { "x-user-id": "7" } });
  assert.equal(missing.statusCode, 404);
  assert.deepEqual(missing.json(), { error: "post not found" });
});

test("unknown routes are a 404 with an error body", async () => {
  const r = await inject({ url: "/nope" });
  assert.equal(r.statusCode, 404);
  assert.deepEqual(r.json(), { error: "not found" });
});

test("bodies over the size limit are rejected", async () => {
  const r = await inject({ method: "POST", url: "/posts", headers: { ...json, "x-user-id": "7" }, payload: { body: "x".repeat(20_000) } });
  assert.equal(r.statusCode, 413);
});

test("a full database queue is a 503 with Retry-After, and /health still answers", async () => {
  overloaded = true;
  try {
    const r = await inject({ url: "/feed" });
    assert.equal(r.statusCode, 503);
    assert.equal(r.headers["retry-after"], "1");
    assert.equal(typeof r.json().error, "string");
    assert.equal((await inject({ url: "/health" })).statusCode, 200);
  } finally {
    overloaded = false;
  }
});
