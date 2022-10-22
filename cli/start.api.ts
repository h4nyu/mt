import { Argv } from "yargs";
import { App } from "@kgy/server/http";
import pino from "pino";

export default {
  command: "api",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: () => {
    const logger = pino();
    const app = App({ logger });
    app.listen({ port: 3000 });
  },
};
