export enum ErrorName {
  NotFound = "NotFound",
  AlreadyExists = "AlreadyExists",
}

export const error = (name: ErrorName, message: string): Error => {
  const err = Error(message);
  err.name = name;
  return err;
};
