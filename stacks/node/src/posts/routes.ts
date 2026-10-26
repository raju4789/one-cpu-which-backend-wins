import type { FastifyInstance } from "fastify";
import { config } from "../config.js";
import { FeedCache } from "../feedCache.js";
import { feedCacheRequests } from "../metrics.js";
import { createPostSchema, likeSchema } from "./schemas.js";
import type { PostService } from "./service.js";

type UserHeaders = { "x-user-id": number };

export async function postRoutes(app: FastifyInstance, opts: { posts: PostService }): Promise<void> {
  const { posts } = opts;
  const cache = config.feedCache
    ? new FeedCache(config.feedCacheTtlMs, () => posts.feedJson(), (hit) =>
        feedCacheRequests.inc({ result: hit ? "hit" : "miss" }),
      )
    : null;

  // The feed is serialized once by the service, so a cached copy is just a string.
  app.get("/feed", async (_req, reply) => {
    const json = cache ? await cache.get() : await posts.feedJson();
    return reply.type("application/json; charset=utf-8").send(json);
  });

  app.post<{ Headers: UserHeaders; Body: { body: string } }>(
    "/posts",
    { schema: createPostSchema },
    async (req, reply) => {
      const post = await posts.create(req.headers["x-user-id"], req.body.body);
      return reply.code(201).send(post);
    },
  );

  app.post<{ Headers: UserHeaders; Params: { id: number } }>(
    "/posts/:id/like",
    { schema: likeSchema },
    async (req, reply) => {
      await posts.like(req.params.id, req.headers["x-user-id"]);
      return reply.code(204).send();
    },
  );
}
