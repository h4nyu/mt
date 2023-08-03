export enum ErrorName {
  NotFound = "NotFound",
  AlreadyExists = "AlreadyExists",
  RetryableError = "RetryableError",
  ValidationError = "ValidationError",
  InvalidArgument = "InvalidArgument",
  ConfigError = "ConfigError",
  UnknownError = "UnknownError",
}

export const Err = (req: {
  name: ErrorName | string;
  message: string;
  prev?: Error;
}): Error => {
  const { name, message, prev } = req;
  const err = new Error(message);
  err.name = name;
  if (typeof prev?.stack === "string") {
    err.stack += "\n" + prev.stack;
  }

  if (typeof prev?.message === "string") {
    err.message += "\n" + prev.message;
  }
  return err;
};
