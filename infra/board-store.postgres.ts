import { PrismaClient, Prisma } from "./prisma/client";
import { Board, BoardRow } from "@kgy/core/board";

import { BoardStore as IBoardStore } from "@kgy/core/interfaces";

export const BoardStore = (props: { prisma: PrismaClient }) => {
  const write: IBoardStore["create"] = async (req) => {
    const rows: Prisma.BoardCreateManyInput[] = req.map((board: Board) => {
      return {
        symbol: board.symbol,
        exchange: board.exchange ?? null,
        currentTime: board.time,
        currentPrice: board.price,
        currentSign: board.sign ?? null,
        askSign: board.askSign,
        bidSign: board.bidSign,
        overQuantity: board.overQuantity,
        underQuantity: board.underQuantity,
      };
    });
    const boardRows: Prisma.BoardRowCreateManyInput[] = req.flatMap(
      (board: Board) => {
        return [
          ...board.asks.map((x, i) => {
            return {
              price: x.price,
              quantity: x.quantity,
              kind: "ASK",
              order: i,
              symbol: board.symbol,
              currentTime: board.time,
            };
          }),
          ...board.bids.map((x, i) => {
            return {
              price: x.price,
              quantity: x.quantity,
              kind: "BID",
              order: i,
              symbol: board.symbol,
              currentTime: board.time,
            };
          }),
        ];
      },
    );
    try {
      await props.prisma.$transaction(async (tx) => {
        await tx.board.createMany({
          data: rows,
        });
        await tx.boardRow.createMany({
          data: boardRows,
        });
      });
    } catch (e) {
      return e;
    }
  };
  const read: IBoardStore["read"] = async (req) => {
    const { symbols, from, to, limit } = req;
    try {
      const rows = await props.prisma.board.findMany({
        where: {
          symbol: {
            in: symbols,
          },
          currentTime: {
            gte: from,
            lte: to ?? new Date(),
          },
        },
        take: limit,
        include: {
          BoardRow: {
            orderBy: {
              order: "asc",
            },
          },
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
            symbol: row.symbol,
            exchange: row.exchange ?? undefined,
            price: row.currentPrice ?? undefined,
            time: row.currentTime ?? undefined,
            sign: (row.currentSign as Board["sign"]) ?? undefined,
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