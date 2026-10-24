import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { config } from "./config.js";

// One pool, one PrismaClient for the whole process. The pool is created here
// (not inside Prisma) so its size is explicit and its state can be exported as metrics.
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: config.dbPoolMax,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  application_name: "one-cpu-node",
});

export const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export async function checkDatabase(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}

export async function closeDatabase(): Promise<void> {
  await prisma.$disconnect();
  await pool.end().catch(() => undefined); // the adapter may already have ended it
}
