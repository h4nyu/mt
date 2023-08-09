import pino from "pino";

export const Logger = (props?: { level?: string }) => {
  return pino();
};
