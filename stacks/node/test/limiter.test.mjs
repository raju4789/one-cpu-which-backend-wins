import { test } from "node:test";
import assert from "node:assert/strict";
const { ConcurrencyLimit, Overloaded } = await import("../dist/limiter.js");

const gate = () => {
  let open;
  const opened = new Promise((resolve) => { open = resolve; });
  return { opened, open };
};

test("runs work while under the limit", async () => {
  const limit = new ConcurrencyLimit(2);
  assert.equal(await limit.run(async () => 42), 42);
  assert.equal(limit.inFlight, 0);
});

test("answers Overloaded (503) once the limit is reached, without running the work", async () => {
  const limit = new ConcurrencyLimit(2);
  const g = gate();
  const a = limit.run(() => g.opened);
  const b = limit.run(() => g.opened);
  let ran = false;
  await assert.rejects(limit.run(async () => { ran = true; }), (err) => err instanceof Overloaded && err.statusCode === 503);
  assert.equal(ran, false);
  g.open();
  await Promise.all([a, b]);
  assert.equal(limit.inFlight, 0);
});

test("frees the slot when the work fails, and passes the error on", async () => {
  const limit = new ConcurrencyLimit(1);
  await assert.rejects(limit.run(async () => { throw new Error("db down"); }), /db down/);
  assert.equal(limit.inFlight, 0);
  assert.equal(await limit.run(async () => "ok"), "ok");
});
