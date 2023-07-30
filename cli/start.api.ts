import { Argv } from "yargs";
import { App } from "@kgy/infra/http";
import pino from "pino";

export default {
  command: "api",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: () => {
    const logger = pino();
    const app = App({ logger });
    app.listen(3000, "0.0.0.0", (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  },
};
