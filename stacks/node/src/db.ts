import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { config } from "./config.js";
import { statementName } from "./statements.js";

// One pool, one PrismaClient for the whole process. The pool is created here
// (not inside Prisma) so its size is explicit and its state can be exported as metrics.
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: config.dbPoolMax,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: config.dbConnectTimeoutMs,
  statement_timeout: config.dbStatementTimeoutMs,
  application_name: "one-cpu-node",
});

// An idle connection can fail (Postgres restarted, network blip). pg emits
// that as an "error" event, which crashes the process if nobody listens.
// The pool drops the broken connection and opens a new one when needed.
let onPoolError: (err: Error) => void = (err) => console.error(err);
pool.on("error", (err) => onPoolError(err));
export function handlePoolErrors(handler: (err: Error) => void): void {
  onPoolError = handler;
}

// Named prepared statements: each query is parsed and planned once per
// connection, then reused (src/statements.ts).
export const prisma = new PrismaClient({ adapter: new PrismaPg(pool, { statementNameGenerator: statementName }) });

// Waits for Postgres at startup instead of crashing if it is a moment late.
export async function waitForDatabase(retries: number, onRetry: (attempt: number, err: unknown) => void): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch (err) {
      if (attempt >= retries) throw err;
      onRetry(attempt, err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export async function closeDatabase(): Promise<void> {
  await prisma.$disconnect();
  await pool.end().catch(() => undefined); // the adapter may already have ended it
}
