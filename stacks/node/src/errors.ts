import { Prisma } from "./generated/prisma/client.js";

// Errors the API can return, with the status codes from contract/openapi.yaml.
export class ApiError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const badRequest = (message: string) => new ApiError(400, message);
export const notFound = (message: string) => new ApiError(404, message);

// A foreign key violation (Prisma P2003) says which reference was missing,
// so no extra lookup query is needed: an unknown user is the caller's fault
// (400), a missing post is a 404. Constraint names are the Postgres defaults
// for contract/schema.sql.
const constraintErrors: Record<string, () => ApiError> = {
  likes_user_id_fkey: () => badRequest("unknown user"),
  posts_user_id_fkey: () => badRequest("unknown user"),
  likes_post_id_fkey: () => notFound("post not found"),
};

export function fromDatabaseError(err: unknown): ApiError | null {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2003") return null;
  const constraint = violatedConstraint(err.meta);
  return constraint ? (constraintErrors[constraint]?.() ?? null) : null;
}

// With the pg driver adapter, the constraint is at meta.driverAdapterError.cause.constraint.index.
function violatedConstraint(meta: unknown): string | undefined {
  const cause = (meta as { driverAdapterError?: { cause?: { constraint?: { index?: unknown } } } } | undefined)
    ?.driverAdapterError?.cause;
  const index = cause?.constraint?.index;
  return typeof index === "string" ? index : undefined;
}
