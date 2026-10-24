// All configuration comes from the environment, as the harness sets it.
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer, got "${raw}"`);
  return value;
}

export const config = {
  port: int("PORT", 8080),
  metricsPort: int("METRICS_PORT", 9464),
  databaseUrl: required("DATABASE_URL"),
  // "app": cache GET /feed in memory for 1 s. "off": never cache. Set by the harness per phase.
  feedCache: process.env.FEED_CACHE === "app",
  feedCacheTtlMs: 1000,
  // Postgres connection pool. One CPU is shared with Postgres, so more
  // connections than busy queries only adds context switching. See README.
  dbPoolMax: int("DB_POOL_MAX", 10),
  // Benchmark rule: warnings and errors only, no per-request lines (Nginx keeps the access log).
  logLevel: process.env.LOG_LEVEL ?? "warn",
  shutdownGraceMs: int("SHUTDOWN_GRACE_MS", 10_000),
};
