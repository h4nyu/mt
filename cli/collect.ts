import { Argv } from "yargs";
import pino from "pino";
import { Prisma } from "@kgy/infra/prisma";
import { BoardStore } from "@kgy/infra/board-store.postgres";
import { KabusApi } from "@kgy/infra/kabus-api";
import { SaveBoardFn } from "@kgy/usecase/save-board";
import { Run } from "@kgy/infra/runner";

export default {
  command: "collect",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: async () => {
    const logger = pino();
    const prisma = Prisma();
    const store = {
      board: BoardStore({ prisma }),
    };
    const kabusApi = KabusApi({ logger });
    const res = await kabusApi.subscribe({
      symbols: ["9433"],
      handler: Run({
        task: SaveBoardFn({ store }),
        logger,
      }),
    });
    if (res instanceof Error) throw res;
  },
};
