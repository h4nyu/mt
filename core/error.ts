export enum ErrorName {
  NotFound = "NotFound",
  AlreadyExists = "AlreadyExists",
}

export const error = (
  name: ErrorName,
  message: string,
  prev?: Error
): Error => {
  const err = new Error(message);
  err.name = name;
  if (typeof prev?.stack === 'string') {
    err.stack += '\n' + prev.stack;
  }

  if (typeof prev?.message === 'string') {
    err.message += '\n' + prev.message;
  }
  return err;
};
