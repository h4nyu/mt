import { PrismaClient } from "./prisma/client";
import { nanoid } from "nanoid";

import { BoardStore } from "./board-store.postgres";
import { Board } from "@kgy/core/board";
import { Sign } from "@kgy/core/constants";

describe("BoardStore", () => {
  const setup = () => {
    const prisma = new PrismaClient();
    const boardStore = BoardStore({ prisma });
    const symbol = nanoid();
    return { prisma, boardStore, symbol };
  };
  test("write & read", async () => {
    const { boardStore, symbol } = setup();
    const board = Board({
      symbol,
      price: 300.0,
      time: new Date(),
      askSign: Sign.UP,
      bidSign: Sign.DOWN,
      asks: [
        {
          price: 100,
          quantity: 10,
        },
        {
          price: 101,
          quantity: 11,
        },
      ],
      bids: [
        {
          price: 100,
          quantity: 100,
        },
        {
          price: 99,
          quantity: 101,
        },
      ],
    });
    const wErr = await boardStore.write([board]);
    if (wErr instanceof Error) throw wErr;
    const read = await boardStore.read({
      symbols: [symbol],
    });
    if (read instanceof Error) throw read;
    expect(read).toEqual([board]);
  });
});
