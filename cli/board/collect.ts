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
        "8035.T",
        "9984.T",
        "6701.T",
        "7203.T",
        "7267.T",
        "7974.T",
        "9983.T",
        "9983.T",
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
        saveBoard.run({ board });
      },
    });
    if (res instanceof Error) {
      logger.error(res.message);
    }
  },
};
