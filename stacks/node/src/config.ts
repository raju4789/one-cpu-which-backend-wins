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
  // Postgres connection pool. Tried 4 (the "2 to 3 per core" rule of thumb):
  // Postgres used no less CPU, requests just waited longer in Node. See the
  // tuning log.
  dbPoolMax: int("DB_POOL_MAX", 10),
  // Load shedding: at most this many requests wait for a connection on top of
  // the ones using the pool; more get 503 at once (src/limiter.ts). At about
  // 1,850 req/s, 300 waiting is roughly 160 ms of queue: enough to absorb
  // bursts, far from the multi-second queues that never drained. 100 shed
  // bursts while the server still had headroom (tuning log).
  dbMaxQueue: int("DB_MAX_QUEUE", 300),
  // Backstop: never wait longer than this for a connection.
  dbConnectTimeoutMs: int("DB_CONNECT_TIMEOUT_MS", 1_000),
  // Benchmark rule: warnings and errors only, no per-request lines (Nginx keeps the access log).
  logLevel: process.env.LOG_LEVEL ?? "warn",
  // A query running longer than this is cancelled by Postgres instead of holding a connection.
  dbStatementTimeoutMs: int("DB_STATEMENT_TIMEOUT_MS", 5_000),
  startupRetries: int("STARTUP_RETRIES", 30),
  // Below Docker's default 10 s stop timeout, so we exit cleanly before SIGKILL.
  shutdownGraceMs: int("SHUTDOWN_GRACE_MS", 8_000),
  bodyLimitBytes: 16 * 1024, // a post is at most 280 characters

};
