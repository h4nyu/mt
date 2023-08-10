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
  const chunkSize = props.chunkSize || 1000;
  const run = async (req: { 
    code: string; 
    cursor?: Date;
    limit?: number 
  }) => {
    const paginate = Paginate({
      chunkSize,
      fn: async (x) =>
        props.store.board.read({
          ...req,
          ...x,
        }),
      getCursor: (x: Board) => x.time,
    });
    return paginate({
      cursor: req.cursor,
      limit: req.limit,
    });
  };
  return {
    run,
    kind: TaskKind.READ_BOARD,
  };
};
