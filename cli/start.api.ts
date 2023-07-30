import { Argv } from "yargs";
import { App } from "@kgy/infra/http";
import { Logger } from "@kgy/infra/logger";

export default {
  command: "api",
  builder: (yargs: Argv) => {
    return yargs;
  },
  handler: () => {
    const logger = Logger();
    const app = App({ logger });
    app.listen(3000, "0.0.0.0", (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  },
};
