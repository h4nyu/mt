import { Argv } from "yargs";
import { GmoCoin } from "@kgy/server/gmo-coin";
import { Symbol } from "@kgy/core";
import { TickerStore } from "@kgy/server/ticker-store";
import { Postgresql } from "@kgy/server/postgresql";
import { CreateFn } from "@kgy/core/ticker/create";
import pino from "pino";

export default {
  command: "start",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: () => {
    const sql = Postgresql();
    const logger = pino();
    const store = {
      ticker: TickerStore(sql),
    };
    const exchange = GmoCoin({
      logger
    });
    exchange.subscribe(
      Symbol.BTC,
      CreateFn({ store, logger })
    );
  },
};
