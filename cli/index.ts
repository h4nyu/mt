import yargs from "yargs";
import board from "./board";

yargs(process.argv.slice(2))
  .scriptName("kgy")
  .command(board.command, board.description, board)
  .demandCommand()
  .help().argv;
