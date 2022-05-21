import yargs from "yargs";
import start from "./start";

const root = yargs.scriptName("kgy").command(start);
root.demandCommand().strictCommands().help().argv;
