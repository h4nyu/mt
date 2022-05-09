import { Argv } from "yargs";
import { GmoCoin } from "@kaguya/server/gmo-coin";
import { TickerStore } from "@kaguya/server/ticker-store";
import { Postgresql } from "@kaguya/server/postgresql";
import { CreateFn } from "@kaguya/core/ticker/create";
import pino from "pino";

export default {
  command: "start",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: () => {
    const sql = Postgresql();
    const exchange = GmoCoin();
    const logger = pino();
    const store = {
      ticker: TickerStore(sql),
    };
    exchange.subscribe(CreateFn({ store }));
  },
};
