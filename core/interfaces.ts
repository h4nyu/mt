import { Board } from "./board";
import { Readable, Writable } from "stream";
import { FileMeta } from "@kgy/core/file-meta";
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

export type Storage = {
  filter: (req: { prefix: string }) => Promise<FileMeta[] | Error>;
  read: (req: { path: string }) => Promise<Buffer | Error>;
  readStream: (req: { path: string }) => Promise<Readable | Error>;
  write: (
    req: { path: string; buffer: Buffer } | { path: string; stream: Readable },
  ) => Promise<void | Error>;
  writeStream: (req: { path: string }) => Promise<Writable | Error>;
  delete: (req: { path: string }) => Promise<void | Error>;
  exists: (req: { path: string }) => Promise<boolean | Error>;
};

export type Task =
  | {
      kind: TaskKind.SAVE_BOARD;
      run: (req: { board: Board }) => Promise<void | Error>;
    }
  | {
      kind: TaskKind.READ_BOARD;
      run: (req: { code: string }) => Promise<Paginate<Board>>;
    };
