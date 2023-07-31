import { Prisma as _Prisma, PrismaClient } from "./client";
import { Err, ErrorName } from "@kgy/core/error";
import { Logger } from "@kgy/core/logger";

export const Prisma = (props?: { logger: Logger }) => {
  const prisma = new PrismaClient({
    log:
      process.env.ENVIRONMENT === "development"
        ? [{ emit: "event", level: "query" }]
        : [],
  });
  if (props?.logger) {
    prisma.$on("query", (e) => {
      props.logger.debug(e);
    });
  }
  return prisma;
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
