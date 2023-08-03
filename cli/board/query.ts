import { Argv } from "yargs";
import { range } from "lodash";
import { Prisma } from "@kgy/infra/prisma";
import { BoardStore } from "@kgy/infra/board-store.postgres";
import { KabusApi } from "@kgy/infra/kabus-api";
import { SaveBoardFn } from "@kgy/usecase/save-board";
import { Run } from "@kgy/infra/runner";
import { Logger } from "@kgy/infra/logger";
import { ReadBoardFn } from "@kgy/usecase/read-board";
import { TsvHeader } from "@kgy/cli/view/tsv-header";
import { TsvRow } from "@kgy/cli/view/tsv-row";

export default {
  command: "query",
  description: "Query boards",
  builder: (yargs: Argv) => {
    return yargs
      .option("code", {
        type: "string",
        alias: "s",
        description: "Symbol",
        demandOption: true,
      })
      .option("limit", {
        type: "number",
        alias: "l",
        description: "Limit",
        demandOption: false,
      });
  },
  handler: async (argv) => {
    const prisma = Prisma();
    const logger = Logger();
    const store = {
      board: BoardStore({ prisma }),
    };
    const out = process.stdout;
    const iter = await ReadBoardFn({ store, logger }).run({
      code: argv.code,
      limit: argv.limit,
    });
    const columns = [
      "code",
      "time",
      "price",
      "underQuantity",
      "overQuantity",
      ...range(10).flatMap((i) => [`asks[${i}].price`, `asks[${i}].quantity`]),
      ...range(10).flatMap((i) => [`bids[${i}].price`, `bids[${i}].quantity`]),
    ];
    out.write(TsvHeader({ columns })());
    for await (const board of iter) {
      if (board instanceof Error) throw board;
      out.write(TsvRow({ columns, row: board })());
    }
  },
};
