import { Prisma } from "@kgy/infra/prisma";
import { Logger } from "@kgy/infra/logger";
import { ArgumentsCamelCase } from "yargs";
import { BoardStore } from "@kgy/infra/board-store.postgres";
import { App } from "@kgy/infra/http";

export default {
  command: "serve",
  description: "Start API server",
  builder: (yargs) => {
    return yargs;
  },
  handler: async () => {
    const prisma = Prisma();
    const logger = Logger();
    const store = {
      board: BoardStore({ prisma }),
    };
    const app = App({
      logger,
      store,
    });
    try {
      await app.listen({
        port: 3000,
        host: "0.0.0.0",
      });
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  },
};
