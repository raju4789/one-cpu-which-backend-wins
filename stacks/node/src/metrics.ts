import http from "node:http";
import client from "@prometheus-io/client";
import type { Pool } from "pg";

// Prometheus metrics on a separate port (9464), so scraping never competes
// with API traffic for a place in Nginx or the API's routes.
export const registry = new client.Registry();

// Node runtime: event loop lag, GC pauses, heap, CPU, open handles.
// On one CPU, event loop lag is the number that tells you the process is saturated.
client.collectDefaultMetrics({ register: registry, eventLoopMonitoringPrecision: 10 });

// Names shared by every stack (app_*), so Grafana can compare them side by side.
export const httpDuration = new client.Histogram({
  name: "app_http_request_duration_seconds",
  help: "Time spent in the app per request, from routing to response sent",
  labelNames: ["method", "route", "status"] as const,
  buckets: [0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [registry],
});

export const feedCacheRequests = new client.Counter({
  name: "app_feed_cache_requests_total",
  help: "GET /feed answered from the in-app cache (hit) or loaded from Postgres (miss)",
  labelNames: ["result"] as const,
  registers: [registry],
});

export function registerPoolMetrics(pool: Pool, max: number): void {
  new client.Gauge({
    name: "app_db_pool_connections",
    help: "Database connections by state: in use, idle, and requests waiting for one",
    labelNames: ["state"] as const,
    registers: [registry],
    collect() {
      this.set({ state: "in_use" }, pool.totalCount - pool.idleCount);
      this.set({ state: "idle" }, pool.idleCount);
      this.set({ state: "waiting" }, pool.waitingCount);
    },
  });
  new client.Gauge({
    name: "app_db_pool_max",
    help: "Configured maximum size of the database connection pool",
    registers: [registry],
    collect() {
      this.set(max);
    },
  });
}

export function startMetricsServer(port: number): http.Server {
  const server = http.createServer(async (req, res) => {
    if (req.url !== "/metrics") {
      res.writeHead(404).end();
      return;
    }
    try {
      const body = await registry.metrics();
      res.writeHead(200, { "Content-Type": registry.contentType }).end(body);
    } catch (err) {
      res.writeHead(500).end(String(err));
    }
  });
  server.listen(port, "0.0.0.0");
  return server;
}
