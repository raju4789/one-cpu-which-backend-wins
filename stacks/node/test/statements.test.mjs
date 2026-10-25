import { test } from "node:test";
import assert from "node:assert/strict";
const { statementName } = await import("../dist/statements.js");

const q = (sql, argTypes = [{ scalarType: "bigint" }]) => ({ sql, args: [], argTypes });

test("the same query always gets the same name", () => {
  assert.equal(statementName(q("SELECT 1")), statementName(q("SELECT 1")));
});

test("different SQL or different parameter types get different names", () => {
  const a = statementName(q("SELECT $1"));
  assert.notEqual(a, statementName(q("SELECT $1 + 1")));
  assert.notEqual(a, statementName(q("SELECT $1", [{ scalarType: "string" }])));
});

test("names are valid Postgres identifiers (letter first, at most 63 characters)", () => {
  const name = statementName(q("SELECT * FROM posts"));
  assert.match(name, /^[a-z][a-z0-9_]*$/);
  assert.ok(name.length <= 63);
});
