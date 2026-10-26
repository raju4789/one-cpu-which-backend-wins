import { createHash } from "node:crypto";

// Names for prepared statements. With a name, pg prepares a query once per
// connection and Postgres reuses its parsed form and plan; without one, every
// execution is parsed and planned again. Measured with pgbench on the feed
// query: 0.238 ms per query unnamed, 0.197 ms named (17% less).
//
// The name must be unique per distinct SQL text and parameter types, or two
// different queries would collide on one connection, so it's a hash of both.
// Prisma generates a handful of distinct queries, so the cache stays tiny; the
// cap is only a guard against unbounded growth.
const MAX_CACHED = 1000;
const names = new Map<string, string>();

export function statementName(query: { sql: string; argTypes: unknown[] }): string {
  const key = `${query.sql}\u0000${JSON.stringify(query.argTypes)}`;
  let name = names.get(key);
  if (name === undefined) {
    name = `s_${createHash("sha1").update(key).digest("hex").slice(0, 24)}`;
    if (names.size < MAX_CACHED) names.set(key, name);
  }
  return name;
}
