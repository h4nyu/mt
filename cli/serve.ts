import { ArgumentsCamelCase } from "yargs";
import { App } from "@kgy/infra/http";

export default {
  command: "serve",
  description: "Start API server",
  builder: (yargs) => {
    return yargs;
  },
  handler: async () => {
    const app = App();
    try {
      await app.listen({ port: 3000 });
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  },
};
