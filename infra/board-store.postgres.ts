import { PrismaClient, Prisma } from "./prisma/client";
import { Board, BoardRow } from "@kgy/core/board";
import { max } from "lodash";

import { BoardStore as IBoardStore } from "@kgy/core/interfaces";

export const BoardStore = (props: { prisma: PrismaClient }) => {
  const write: IBoardStore["write"] = async (board) => {
    const boardData = {
      code: board.code,
      time: board.time,
      price: board.price ?? null,
      sign: board.sign ?? null,
      askSign: board.askSign,
      bidSign: board.bidSign,
      overQuantity: board.overQuantity,
      underQuantity: board.underQuantity,
    };
    const boardRowData: Prisma.BoardRowCreateManyInput[] = [
      ...board.asks.map((x, i) => {
        return {
          price: x.price,
          quantity: x.quantity,
          kind: "ASK",
          order: i,
          code: board.code,
          time: board.time,
        };
      }),
      ...board.bids.map((x, i) => {
        return {
          price: x.price,
          quantity: x.quantity,
          kind: "BID",
          order: i,
          code: board.code,
          time: board.time,
        };
      }),
    ];
    try {
      await props.prisma.$transaction(async (tx) => {
        await tx.board.upsert({
          where: {
            code_time: {
              time: boardData.time,
              code: boardData.code,
            },
          },
          create: boardData,
          update: boardData,
        });
        await tx.boardRow.deleteMany({
          where: {
            time: boardData.time,
            code: boardData.code,
          },
        });
        await tx.boardRow.createMany({
          data: boardRowData,
        });
      });
    } catch (e) {
      return e;
    }
  };
  const read: IBoardStore["read"] = async (req) => {
    const { code, from, to, limit, cursor } = req;

    const time = (() => {
      const base = {
        gt: from,
        lte: to,
      };
      if (cursor) {
        base.gt = max([cursor, from]) ?? from;
      }
      return base;
    })();
    try {
      const rows = await props.prisma.board.findMany({
        where: {
          code,
          time,
        },
        take: limit,
        include: {
          BoardRow: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          time: "asc",
        },
      });
      const res: Board[] = [];
      for (const row of rows) {
        const asks: BoardRow[] = [];
        const bids: BoardRow[] = [];
        for (const boardRow of row.BoardRow) {
          const { kind, price, quantity } = boardRow;
          if (kind === "ASK") {
            asks.push(BoardRow({ price, quantity }));
          } else if (kind === "BID") {
            bids.push(BoardRow({ price, quantity }));
          }
        }
        res.push(
          Board({
            code: row.code,
            price: row.price ?? undefined,
            time: row.time ?? undefined,
            sign: (row.sign as Board["sign"]) ?? undefined,
            askSign: (row.askSign as Board["askSign"]) ?? undefined,
            bidSign: (row.bidSign as Board["bidSign"]) ?? undefined,
            asks,
            bids,
            overQuantity: row.overQuantity ?? undefined,
            underQuantity: row.underQuantity ?? undefined,
          }),
        );
      }
      return res;
    } catch (e) {
      return e;
    }
  };
  return {
    write,
    read,
  };
};
