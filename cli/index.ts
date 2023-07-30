import yargs from "yargs";
import startApi from "./start.api";

const root = yargs.scriptName("kgy").command("start", "start", (yargs) => {
  yargs.command(startApi).demandCommand();
});
root.demandCommand().strictCommands().help().argv;
