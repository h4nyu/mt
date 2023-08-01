import { Prisma } from "./prisma";
import { nanoid } from "nanoid";
import { range } from "lodash";

import { BoardStore } from "./board-store.postgres";
import { Board } from "@kgy/core/board";
import { Sign } from "@kgy/core/constants";

describe("BoardStore", () => {
  const setup = () => {
    const prisma = Prisma({ logger: console });
    const boardStore = BoardStore({ prisma });
    const code = nanoid();
    const genBoard = () =>
      Board({
        code,
        price: 1,
        time: new Date(),
        askSign: Sign.UP,
        bidSign: Sign.DOWN,
        asks: range(2).map((x) => ({ price: x, quantity: x })),
        bids: range(1).map((x) => ({ price: x, quantity: x })),
      });
    return { prisma, boardStore, code, genBoard };
  };
  test("write & read", async () => {
    const { boardStore, code, genBoard } = setup();
    const board = genBoard();
    const wErr = await boardStore.write(board);
    if (wErr instanceof Error) throw wErr;
    let read = await boardStore.read({
      code,
    });
    if (read instanceof Error) throw read;
    expect(read).toEqual([board]);

    const overwrite = await boardStore.write({
      ...board,
      price: (board.price ?? 0) + 1,
    });
    if (overwrite instanceof Error) throw overwrite;

    read = await boardStore.read({
      code,
    });
    if (read instanceof Error) throw read;
    expect(read).toEqual([
      {
        ...board,
        price: (board.price ?? 0) + 1,
      },
    ]);
  });

  test("cursor", async () => {
    const { boardStore, code, genBoard } = setup();
    const boards = range(9).map((x) =>
      Board({
        ...genBoard(),
        time: new Date(`2021-01-01T00:00:0${x}.000Z`),
      }),
    );
    const otherBoards = range(5).map((x) =>
      Board({ ...genBoard(), code: nanoid() }),
    );
    for (const board of [...boards, ...otherBoards]) {
      await boardStore.write(board);
    }
    let read = await boardStore.read({
      code,
      cursor: new Date("2021-01-01T00:00:03.000Z"),
      limit: 2,
    });
    if (read instanceof Error) throw read;
    read = await boardStore.read({
      code,
      cursor: new Date("2021-01-01T00:00:03.100Z"),
      limit: 2,
    });
    if (read instanceof Error) throw read;
    expect(read).toEqual([boards[4], boards[5]]);
  });
});
