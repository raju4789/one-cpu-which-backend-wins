// JSON schemas for contract/openapi.yaml. Fastify uses them twice:
// to validate requests (Ajv) and to serialize responses (fast-json-stringify,
// several times faster than JSON.stringify because the shape is known).

const author = {
  type: "object",
  required: ["id", "username", "display_name"],
  properties: {
    id: { type: "integer" },
    username: { type: "string" },
    display_name: { type: "string" },
  },
} as const;

export const post = {
  type: "object",
  required: ["id", "body", "like_count", "created_at", "author"],
  properties: {
    id: { type: "integer" },
    body: { type: "string" },
    like_count: { type: "integer" },
    created_at: { type: "string", format: "date-time" },
    author,
  },
} as const;

export const feedResponse = {
  type: "object",
  required: ["posts"],
  properties: { posts: { type: "array", items: post } },
} as const;

const error = {
  type: "object",
  required: ["error"],
  properties: { error: { type: "string" } },
} as const;

const userHeader = {
  type: "object",
  required: ["x-user-id"],
  properties: { "x-user-id": { type: "integer", minimum: 1 } },
} as const;

export const createPostSchema = {
  headers: userHeader,
  body: {
    type: "object",
    required: ["body"],
    properties: { body: { type: "string", minLength: 1, maxLength: 280 } },
  },
  response: { 201: post, 400: error },
} as const;

export const likeSchema = {
  headers: userHeader,
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "integer", minimum: 1 } },
  },
  response: { 400: error, 404: error },
} as const;

export const healthSchema = {
  response: {
    200: { type: "object", required: ["status"], properties: { status: { type: "string" } } },
  },
} as const;
