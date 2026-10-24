import { test } from "node:test";
import assert from "node:assert/strict";
import { FeedCache } from "../dist/feedCache.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("concurrent requests during a reload share one load (single flight)", async () => {
  let loads = 0;
  const cache = new FeedCache(1000, async () => { loads++; await sleep(20); return "feed"; });
  const results = await Promise.all(Array.from({ length: 50 }, () => cache.get()));
  assert.equal(loads, 1);
  assert.ok(results.every((r) => r === "feed"));
});

test("an expired entry is reloaded", async () => {
  let loads = 0;
  const cache = new FeedCache(30, async () => `v${++loads}`);
  assert.equal(await cache.get(), "v1");
  assert.equal(await cache.get(), "v1");
  await sleep(40);
  assert.equal(await cache.get(), "v2");
});

test("a failed load is not cached", async () => {
  let calls = 0;
  const cache = new FeedCache(1000, async () => { if (++calls === 1) throw new Error("db down"); return "ok"; });
  await assert.rejects(cache.get(), /db down/);
  assert.equal(await cache.get(), "ok");
});

test("hits and misses are reported", async () => {
  const seen = [];
  const cache = new FeedCache(1000, async () => "feed", (hit) => seen.push(hit));
  await cache.get();
  await cache.get();
  assert.deepEqual(seen, [false, true]);
});
