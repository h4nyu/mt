import { performance } from "perf_hooks";
import { Logger } from "@kgy/core/logger";
import { Task } from "@kgy/core/interfaces";

export const Run = (props: { logger: Logger; task: Task }) => {
  return async (payload) => {
    const { logger, task } = props;
    const { kind } = task;
    const startTime = performance.now();
    props.logger.info({
      status: "RUNNING",
      kind,
      payload,
    });
    const res = await task.run(payload);
    const endTime = performance.now();
    const elapsed = endTime - startTime;
    if (res instanceof Error) {
      logger.error({
        status: "FAILED",
        kind,
        elapsed,
        payload,
        reason: res.message,
      });
    } else {
      logger.info({
        status: "DONE",
        kind,
        elapsed,
        payload,
      });
    }
    return res;
  };
};
