import yargs from "yargs";
import startCollector from "./start.collector";
import startApi from "./start.api";

const root = yargs.scriptName("kgy").command("start", "start", (yargs) => {
  yargs.command(startCollector);
  yargs.command(startApi).demandCommand();
});
root.demandCommand().strictCommands().help().argv;
