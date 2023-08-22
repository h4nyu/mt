import { Argv } from "yargs";
import { Prisma } from "@kgy/infra/prisma";
import { BoardStore } from "@kgy/infra/board-store.postgres";
import { KabusApi } from "@kgy/infra/kabus-api";
import { SaveBoardFn } from "@kgy/usecase/save-board";
import { Run } from "@kgy/infra/runner";
import { Logger } from "@kgy/infra/logger";
import { Code } from "@kgy/core/constants";

export default {
  command: "collect",
  description: "Collect boards",
  builder: (yargs: Argv) => {
    return yargs.option("codes", {
      type: "array",
      alias: "s",
      demandOption: true,
      description: "Symbols to collect",
      default: Object.values(Code),
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
