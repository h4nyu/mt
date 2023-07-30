import { Argv } from "yargs";
import { Prisma } from "@kgy/infra/prisma";
import { BoardStore } from "@kgy/infra/board-store.postgres";
import { KabusApi } from "@kgy/infra/kabus-api";
import { SaveBoardFn } from "@kgy/usecase/save-board";
import { Run } from "@kgy/infra/runner";
import { Logger } from "@kgy/infra/logger";

export default {
  command: "collect",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: async () => {
    const prisma = Prisma();
    const logger = Logger();
    const store = {
      board: BoardStore({ prisma }),
    };
    const kabusApi = KabusApi({ logger });
    const res = await kabusApi.subscribe({
      symbols: ["8035", "9984", "9983", "9987", "9986", "9989", "1570", "1580"], // TODO: pass from args
      handler: Run({
        task: SaveBoardFn({ store }),
        logger,
      }),
    });
    if (res instanceof Error) {
      logger.error(res);
    }
  },
};
