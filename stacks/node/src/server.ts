import { buildApp } from "./app.js";
import { config } from "./config.js";
import { checkDatabase, closeDatabase, pool, prisma } from "./db.js";
import { registerPoolMetrics, startMetricsServer } from "./metrics.js";
import { PostService } from "./posts/service.js";

// One process on one core. Cluster mode or worker threads would only add
// processes competing for the same CPU, so there is exactly one event loop.
const app = buildApp(new PostService(prisma));
registerPoolMetrics(pool, config.dbPoolMax);
const metricsServer = startMetricsServer(config.metricsPort);

// Only start taking traffic once the database answers, so /health means
// "ready", which is what bin/up waits for.
await checkDatabase();
await app.listen({ port: config.port, host: "0.0.0.0" });
app.log.warn({ port: config.port, feedCache: config.feedCache, dbPoolMax: config.dbPoolMax }, "listening");

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  app.log.warn({ signal }, "shutting down");
  const force = setTimeout(() => process.exit(1), config.shutdownGraceMs);
  force.unref();
  try {
    await app.close(); // stop accepting, finish in-flight requests
    metricsServer.close();
    await closeDatabase();
    process.exit(0);
  } catch (err) {
    app.log.error({ err }, "shutdown failed");
    process.exit(1);
  }
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
