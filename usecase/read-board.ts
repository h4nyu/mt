import { BoardStore, TaskKind } from "@kgy/core/interfaces";
import { Board } from "@kgy/core/board";
import { Logger } from "@kgy/core/logger";
import { Paginate } from "@kgy/core/paginate";

export const ReadBoardFn = (props: {
  store: {
    board: BoardStore;
  };
  logger?: Logger;
  chunkSize?: number;
}) => {
  const chunkSize = props.chunkSize || 100;
  const run = async (req: { symbols: string[] }) => {
    const paginate = Paginate({
      chunkSize,
      fn: async (x) =>
        props.store.board.read({
          ...req,
          ...x,
        }),
      getCursor: (x: Board) => ({
        symbol: x.symbol,
        time: x.time,
      }),
    });
  };
  return {
    run,
    kind: TaskKind.READ_BOARD,
  };
};