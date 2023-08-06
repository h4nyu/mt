import yargs from "yargs";
import board from "./board";
import serve from "./serve";

yargs(process.argv.slice(2))
  .scriptName("kgy")
  .command(board.command, board.description, board)
  .command(serve.command, serve.description, serve)
  .demandCommand()
  .help().argv;
