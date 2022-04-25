import { Argv } from "yargs";
import { GmoCoin } from "@kaguya/server/gmo-coin";
import pino from "pino";

export default {
  command: "start",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: () => {
    const exchange = GmoCoin();
    const logger = pino();
    exchange.subscribe((x) => logger.info(x));
  },
};
