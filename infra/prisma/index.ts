import { Prisma as _Prisma, PrismaClient } from "./client";
import { Err, ErrorName } from "@kgy/core/error";

export const Prisma = () => {
  return new PrismaClient({
    log:
      process.env.ENVIRONMENT === "debug"
        ? ["query", "info", "warn", "error"]
        : [],
  });
};

export const handleError = (e: Error): Error => {
  // https://www.prisma.io/docs/reference/api-reference/error-reference#p1017
  if (
    e instanceof _Prisma.PrismaClientKnownRequestError &&
    e.code === "P1017"
  ) {
    return Err({
      name: ErrorName.RetryableError,
      message: e.message,
      prev: e,
    });
  }
  if (e.message?.includes("running")) {
    return Err({
      name: ErrorName.RetryableError,
      message: e.message,
      prev: e,
    });
  }
  if (e.message?.includes("shutting")) {
    return Err({
      name: ErrorName.RetryableError,
      message: e.message,
      prev: e,
    });
  }

  // https://www.prisma.io/docs/reference/api-reference/error-reference#p2028
  if (
    e instanceof _Prisma.PrismaClientKnownRequestError &&
    e.code === "P2028"
  ) {
    return Err({
      name: ErrorName.RetryableError,
      message: e.message,
      prev: e,
    });
  }
  return e;
};
