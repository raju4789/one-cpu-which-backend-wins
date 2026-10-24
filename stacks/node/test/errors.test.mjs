import { test } from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "../dist/generated/prisma/client.js";
import { fromDatabaseError } from "../dist/errors.js";

const fkError = (constraint) =>
  new Prisma.PrismaClientKnownRequestError("foreign key", {
    code: "P2003",
    clientVersion: "test",
    meta: { driverAdapterError: { cause: { kind: "ForeignKeyConstraintViolation", constraint: { index: constraint } } } },
  });

test("unknown user is a 400", () => {
  assert.equal(fromDatabaseError(fkError("likes_user_id_fkey"))?.statusCode, 400);
  assert.equal(fromDatabaseError(fkError("posts_user_id_fkey"))?.statusCode, 400);
});

test("missing post is a 404", () => {
  assert.equal(fromDatabaseError(fkError("likes_post_id_fkey"))?.statusCode, 404);
});

test("anything else is left alone (becomes a 500)", () => {
  assert.equal(fromDatabaseError(fkError("something_else")), null);
  assert.equal(fromDatabaseError(new Error("boom")), null);
  const other = new Prisma.PrismaClientKnownRequestError("timeout", { code: "P2024", clientVersion: "test" });
  assert.equal(fromDatabaseError(other), null);
});
