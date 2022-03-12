export enum ErrorName {
  OrderNotFound = 'OrderNotFound',
}

export const error = (name: ErrorName, message: string): Error => {
  const err = Error(message);
  err.name = name;
  return err;
};
