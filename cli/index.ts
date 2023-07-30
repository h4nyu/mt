import yargs from "yargs";
import collect from "./collect";

const root = yargs.scriptName("kgy").command(collect);
root.demandCommand().strictCommands().help().argv;
