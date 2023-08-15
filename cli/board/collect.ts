import { Argv } from "yargs";
import { Prisma } from "@kgy/infra/prisma";
import { BoardStore } from "@kgy/infra/board-store.postgres";
import { KabusApi } from "@kgy/infra/kabus-api";
import { SaveBoardFn } from "@kgy/usecase/save-board";
import { Run } from "@kgy/infra/runner";
import { Logger } from "@kgy/infra/logger";

export default {
  command: "collect",
  description: "Collect boards",
  builder: (yargs: Argv) => {
    return yargs.option("codes", {
      type: "array",
      alias: "s",
      demandOption: true,
      description: "Symbols to collect",
      default: [
        "1605.T",
        "4063.T",
        "4519.T",
        "4502.T",
        "4568.T",
        "6098.T",
        "6178.T",
        "6367.T",
        "6501.T",
        "6594.T",
        "6701.T",
        "6723.T",
        "6857.T", 
        "6758.T", // Sony
        "6861.T", 
        "7203.T",
        "7267.T",
        "7974.T",
        "8001.T",
        "8031.T",
        "8035.T",
        "8058.T", 
        "8267.T",
        "8306.T", // MUFG
        "9432.T", // NTT
        "9433.T", // KDDI
        "9983.T",
        "9984.T",
      ],
    });
  },
  handler: async (argv) => {
    const prisma = Prisma();
    const logger = Logger();
    const store = {
      board: BoardStore({ prisma }),
    };
    const kabusApi = KabusApi({ logger });
    const saveBoard = SaveBoardFn({ store });
    const unregErr = await kabusApi.unregisterAll();
    if (unregErr instanceof Error) {
      logger.error(unregErr.message);
    }
    const res = await kabusApi.subscribe({
      codes: argv.codes,
      handler: ({ board }) => {
        Run({
          logger,
          task: SaveBoardFn({ store }),
        })({ board });
      },
    });
    if (res instanceof Error) {
      logger.error(res.message);
    }
  },
};
