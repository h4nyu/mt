import { Argv } from "yargs";
import { z } from "zod";
import { range } from "lodash";
import { Code } from "@kgy/core/constants";
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
  command: "export-all",
  description: "Export all boards",
  builder: (yargs: Argv) => {
    return yargs
  },
  handler: async (argv) => {
    const prisma = Prisma();
    const logger = Logger();
    const store = {
      board: BoardStore({ prisma }),
    };
    const storage = LocalStorage();
    const commandResultFs = CommandResultFs({ 
      storage,
      root: `export-all-${(new Date()).toISOString().replace(/:/g, "-")}`,
    });
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

    for (const code of Object.values(Code)) {
      const iter = await PaginateBoardFn({ store, logger }).run({
        code,
      });
      const ws =await commandResultFs.writeStream({
        code,
        name: "boards.tsv",
      })
      if (ws instanceof Error) throw ws;
      process.stdout.write(`Exporting ${code}...`);
      ws.write(TsvHeader({ columns })());
      for await (const board of iter) {
        if (board instanceof Error) throw board;
        ws.write(TsvRow({ columns, row: board })());
      }
      process.stdout.write(`Done.\n`);
    }
  },
};
