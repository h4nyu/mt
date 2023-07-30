import { BoardStore } from "@kgy/core/interfaces";
import { Board } from "@kgy/core/board";
import { Logger } from "@kgy/core/logger";

export const SaveBoardFn = (props: {
  store: {
    board: BoardStore;
  };
  logger?: Logger;
}) => {
  const run = async (req: { board: Board }) => {
    const { board } = req;
    const err = await props.store.board.write([board]);
    if (err instanceof Error) return err;
  };
};
