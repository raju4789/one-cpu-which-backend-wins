// Errors the API can return, with the status codes from contract/openapi.yaml.
export class ApiError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
  }
}

export const badRequest = (message: string) => new ApiError(400, message);
export const notFound = (message: string) => new ApiError(404, message);

// Postgres foreign key violations tell us which reference was missing:
// an unknown user is the caller's fault (400), a missing post is a 404.
// The constraint names are Postgres defaults for contract/schema.sql.
export function foreignKeyError(err: unknown): ApiError | null {
  const text = describe(err);
  if (!/foreign key|P2003|23503/i.test(text)) return null;
  if (/user_id_fkey/.test(text)) return badRequest("unknown user");
  if (/post_id_fkey/.test(text)) return notFound("post not found");
  return null;
}

function describe(err: unknown): string {
  if (!err || typeof err !== "object") return String(err);
  const e = err as { code?: unknown; message?: unknown; meta?: unknown; cause?: unknown };
  return [e.code, e.message, JSON.stringify(e.meta ?? {}), e.cause ? describe(e.cause) : ""].join(" ");
}
