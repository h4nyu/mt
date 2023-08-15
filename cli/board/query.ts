import { Argv } from "yargs";
import { z } from "zod";
import { range } from "lodash";
import { Prisma } from "@kgy/infra/prisma";
import { BoardStore } from "@kgy/infra/board-store.postgres";
import { KabusApi } from "@kgy/infra/kabus-api";
import { SaveBoardFn } from "@kgy/usecase/save-board";
import { Run } from "@kgy/infra/runner";
import { Logger } from "@kgy/infra/logger";
import { PaginateBoardFn } from "@kgy/usecase/paginate-board";
import { TsvHeader } from "@kgy/cli/view/tsv-header";
import { TsvRow } from "@kgy/cli/view/tsv-row";
import { Writable } from "stream";
import { CommandResultFs } from "@kgy/infra/command-result-fs";
import { LocalStorage } from "@kgy/infra/storage.local";

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
      .option("saveToFile", {
        type: "boolean",
        alias: "f",
        description: "Save to file",
        demandOption: false,
      })
      .option("limit", {
        type: "number",
        alias: "l",
        description: "Limit",
        demandOption: false,
      });
  },
  handler: async (argv) => {
    const { code, limit, saveToFile } = z
      .object({
        saveToFile: z.boolean().optional(),
        code: z.string(),
        limit: z.number().optional(),
      })
      .parse(argv);

    const prisma = Prisma();
    const logger = Logger();
    const store = {
      board: BoardStore({ prisma }),
    };
    const storage = LocalStorage();
    const commandResultFs = CommandResultFs({ storage });

    const iter = await PaginateBoardFn({ store, logger }).run({
      code,
      limit,
    });
    const exportName = `${code}-${new Date().toISOString().replace(/:/g, "-")}`;
    const ws: Writable | Error = saveToFile
      ? await commandResultFs.writeStream({
          code,
          name: `${exportName}.tsv`,
        })
      : process.stdout;
    if (ws instanceof Error) throw ws;
    if (saveToFile) {
      process.stdout.write(`Writing to ${exportName}.tsv\n`);
      process.stdout.write(`Please wait...\n`);
    }

    const columns = [
      "code",
      "time",
      "price",
      "underQuantity",
      "overQuantity",
      "changePreviousClosePrice",
      "changePreviousCloseRate",
      "previousClosePrice",
      "previousCloseTime",
      "openPrice",
      "openTime",
      "highPrice",
      "highTime",
      "lowPrice",
      "lowTime",
      "volume",
      "volumeTime",
      "marketOrderSellQuantity",
      "marketOrderBuyQuantity",
      ...range(10).flatMap((i) => [`asks[${i}].price`, `asks[${i}].quantity`]),
      ...range(10).flatMap((i) => [`bids[${i}].price`, `bids[${i}].quantity`]),
    ];
    ws.write(TsvHeader({ columns })());
    for await (const board of iter) {
      if (board instanceof Error) throw board;
      ws.write(TsvRow({ columns, row: board })());
    }
  },
};
