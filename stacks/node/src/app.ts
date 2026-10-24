import Fastify, { LogController, type FastifyError, type FastifyInstance } from "fastify";
import { config } from "./config.js";
import { ApiError } from "./errors.js";
import { httpDuration } from "./metrics.js";
import { postRoutes } from "./posts/routes.js";
import { healthSchema } from "./posts/schemas.js";
import type { PostService } from "./posts/service.js";

export function buildApp(posts: PostService): FastifyInstance {
  const app = Fastify({
    logger: { level: config.logLevel }, // pino, JSON lines on stdout
    // No per-request log lines: Nginx writes the one access log (docs/rules.md).
    logController: new LogController({ disableRequestLogging: true }),
    // Longer than Nginx's upstream keep-alive, so Node never closes a
    // connection Nginx is about to reuse (that race shows up as 502s).
    keepAliveTimeout: 75_000,
    trustProxy: true,
    return503OnClosing: true,
    bodyLimit: config.bodyLimitBytes,
  });

  // Time spent inside the app, per route. Compared with k6's numbers this
  // shows how much of the latency is the app and how much is everything else.
  app.addHook("onResponse", async (req, reply) => {
    httpDuration.observe(
      { method: req.method, route: req.routeOptions.url ?? "unmatched", status: String(reply.statusCode) },
      reply.elapsedTime / 1000,
    );
  });

  app.get("/health", { schema: healthSchema }, async () => ({ status: "ok" }));
  app.register(postRoutes, { posts });

  // Every error leaves as { error: "..." } with the contract's status code.
  app.setErrorHandler((err: FastifyError | ApiError, req, reply) => {
    if (err instanceof ApiError) return reply.code(err.statusCode).send({ error: err.message });
    if ("validation" in err && err.validation) return reply.code(400).send({ error: err.message });
    const status = err.statusCode ?? 500;
    if (status >= 500) {
      req.log.error({ err }, "request failed");
      return reply.code(500).send({ error: "internal server error" });
    }
    return reply.code(status).send({ error: err.message });
  });

  app.setNotFoundHandler((_req, reply) => reply.code(404).send({ error: "not found" }));

  return app;
}
