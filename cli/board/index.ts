import collect from "./collect";
import query from "./query";
import { ArgumentsCamelCase } from "yargs";

export default {
  command: "board",
  description: "Manage boards",
  builder: (yargs) => {
    return yargs
      .command(collect.command, collect.description, collect)
      .command(query.command, query.description, query)
      .demandCommand();
  },
  handler: (args: ArgumentsCamelCase) => {},
};
