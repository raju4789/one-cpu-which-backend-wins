import fastJson from "fast-json-stringify";
import type { PrismaClient } from "../generated/prisma/client.js";
import { foreignKeyError } from "../errors.js";
import { feedResponse } from "./schemas.js";

const FEED_SIZE = 20;

// The API shape (snake_case, numbers) is separate from the database rows
// (camelCase, BigInt ids). Ids fit in a JS number up to 2^53, far above our data.
export interface PostDto {
  id: number;
  body: string;
  like_count: number;
  created_at: Date; // serialized as ISO 8601 UTC by the response schema
  author: { id: number; username: string; display_name: string };
}

type Row = {
  id: bigint;
  body: string;
  likeCount: number;
  createdAt: Date;
  author: { id: bigint; username: string; displayName: string };
};

const toDto = (p: Row): PostDto => ({
  id: Number(p.id),
  body: p.body,
  like_count: p.likeCount,
  created_at: p.createdAt,
  author: { id: Number(p.author.id), username: p.author.username, display_name: p.author.displayName },
});

const authorFields = { select: { id: true, username: true, displayName: true } } as const;
const postFields = { id: true, body: true, likeCount: true, createdAt: true, author: authorFields } as const;

// The schema objects are "as const" for type inference; fast-json-stringify wants mutable types.
const serializeFeed = fastJson(feedResponse as unknown as Parameters<typeof fastJson>[0]);

export class PostService {
  constructor(private readonly db: PrismaClient) {}

  // Latest 20 posts with their authors, as one SQL query: relationLoadStrategy
  // "join" makes Prisma fetch the author with a LATERAL JOIN instead of a second query.
  async feedJson(): Promise<string> {
    const rows = await this.db.post.findMany({
      select: postFields,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: FEED_SIZE,
      relationLoadStrategy: "join",
    });
    return serializeFeed({ posts: rows.map(toDto) });
  }

  async create(userId: number, body: string): Promise<PostDto> {
    try {
      const row = await this.db.post.create({
        data: { userId: BigInt(userId), body },
        select: postFields,
        relationLoadStrategy: "join",
      });
      return toDto(row);
    } catch (err) {
      throw foreignKeyError(err) ?? err;
    }
  }

  // Idempotent and atomic, in one transaction:
  // 1. insert the like, doing nothing if this user already liked the post
  // 2. only if a row was inserted, increment like_count in SQL (like_count = like_count + 1)
  // Never read-modify-write in app code: under concurrency that loses likes.
  async like(postId: number, userId: number): Promise<void> {
    try {
      await this.db.$transaction(async (tx) => {
        const { count } = await tx.like.createMany({
          data: [{ postId: BigInt(postId), userId: BigInt(userId) }],
          skipDuplicates: true,
        });
        if (count === 1) {
          await tx.post.update({
            where: { id: BigInt(postId) },
            data: { likeCount: { increment: 1 } },
            select: { id: true },
          });
        }
      });
    } catch (err) {
      throw foreignKeyError(err) ?? err;
    }
  }
}
