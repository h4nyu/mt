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
