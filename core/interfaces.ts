import { Board } from "./board";

export type BoardStore = {
  write: (boards: Board[]) => Promise<void | Error>;
  read: (req: {
    symbols: string[];
    from?: Date;
    to?: Date;
    limit?: number;
  }) => Promise<void | Error>;
};
export enum TaskKind {
  SAVE_BOARD = "SAVE_BOARD",
}

export type Task = {
  kind: TaskKind.SAVE_BOARD;
  run: (req: { board: Board }) => Promise<void | Error>;
};
