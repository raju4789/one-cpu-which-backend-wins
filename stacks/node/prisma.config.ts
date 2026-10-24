import { defineConfig, env } from "prisma/config";

// The schema itself is owned by contract/schema.sql and created by the harness.
// Prisma only maps it: no migrations are run from this stack.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: env("DATABASE_URL") },
});
