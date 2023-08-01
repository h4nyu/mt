import { Board } from "./board";
import { Paginate } from "./paginate";

export type BoardStore = {
  write: (board: Board) => Promise<void | Error>;
  read: (req: {
    code: string;
    from?: Date;
    to?: Date;
    cursor?: Board["time"];
    limit?: number;
  }) => Promise<Board[] | Error>;
};
export enum TaskKind {
  SAVE_BOARD = "SAVE_BOARD",
  READ_BOARD = "READ_BOARD",
}

export type Task =
  | {
      kind: TaskKind.SAVE_BOARD;
      run: (req: { board: Board }) => Promise<void | Error>;
    }
  | {
      kind: TaskKind.READ_BOARD;
      run: (req: { code: string }) => Promise<Paginate<Board>>;
    };
