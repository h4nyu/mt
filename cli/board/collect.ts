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
    return yargs.option("symbols", {
      type: "array",
      alias: "s",
      demandOption: true,
      description: "Symbols to collect",
      default: ["8035", "9984", "9983", "9987", "9986", "9989", "1570", "1580"],
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
    const res = await kabusApi.subscribe({
      symbols: argv.symbols,
      handler: ({ board }) => {
        saveBoard.run({ board });
      },
    });
    if (res instanceof Error) {
      logger.error(res);
    }
  },
};
