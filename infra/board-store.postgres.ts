import { PrismaClient, Prisma } from "./prisma/client";
import { Board, BoardRow } from "@kgy/core/board";
import { max } from "lodash";
import { add } from "date-fns";

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
      changePreviousClosePrice: board.changePreviousClosePrice ?? null,
      changePreviousCloseRate: board.changePreviousCloseRate ?? null,
      previousClosePrice: board.previousClosePrice ?? null,
      previousCloseTime: board.previousCloseTime ?? null,
      openPrice: board.openPrice ?? null,
      openTime: board.openTime ?? null,
      highPrice: board.highPrice ?? null,
      highTime: board.highTime ?? null,
      lowPrice: board.lowPrice ?? null,
      lowTime: board.lowTime ?? null,
      volume: board.volume ?? null,
      volumeTime: board.volumeTime ?? null,
      marketOrderSellQuantity: board.marketOrderSellQuantity ?? null,
      marketOrderBuyQuantity: board.marketOrderBuyQuantity ?? null,
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
    const { code, interval, limit, cursor } = req;

    const time = (() => {
      if (cursor) {
        return {
          gt: cursor,
          lte: interval ? add(cursor, { seconds: interval }) : undefined,
        };
      }
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
            changePreviousClosePrice: row.changePreviousClosePrice ?? undefined,
            changePreviousCloseRate: row.changePreviousCloseRate ?? undefined,
            previousClosePrice: row.previousClosePrice ?? undefined,
            previousCloseTime: row.previousCloseTime ?? undefined,
            openPrice: row.openPrice ?? undefined,
            openTime: row.openTime ?? undefined,
            highPrice: row.highPrice ?? undefined,
            highTime: row.highTime ?? undefined,
            lowPrice: row.lowPrice ?? undefined,
            lowTime: row.lowTime ?? undefined,
            volume: row.volume ?? undefined,
            volumeTime: row.volumeTime ?? undefined,
            marketOrderSellQuantity: row.marketOrderSellQuantity ?? undefined,
            marketOrderBuyQuantity: row.marketOrderBuyQuantity ?? undefined,
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
