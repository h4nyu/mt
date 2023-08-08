import { Logger } from "@kgy/core/logger";

export const NotifyChangeFn = (props: { logger?: Logger }) => {
  const run = async (req: { code: string; limit?: number }) => {};
  return {
    run,
  };
};
