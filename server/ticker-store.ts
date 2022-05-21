import { Row, Sql } from "postgres";
import { Ticker } from "@kgy/core/ticker";
import { first } from "lodash";
import { error, ErrorName } from "@kgy/core/error";
import { Symbol } from "@kgy/core";

const TABLE = "tickers";
const COLUMNS = ["symbol", "ask", "bid", "last", "high", "low", "volume", "ts"];

export const TickerStore = (sql: Sql<any>) => {
  const to = (r: Row): Ticker => {
    return Ticker({
      symbol: r.symbol,
      ask: r.ask,
      bid: r.bid,
      last: r.last,
      volume: r.volume,
      high: r.high,
      low: r.low,
      ts: r.ts,
    });
  };

  const from = (r: Ticker): Row => {
    return {
      symbol: r.symbol,
      ask: r.ask,
      bid: r.bid,
      last: r.last,
      volume: r.volume,
      high: r.high,
      low: r.low,
      ts: r.ts,
    };
  };

  const filter = async (req: { symbol?: Symbol }) => {
    try {
      const rows = await (async () => {
        const { symbol } = req;
        if (symbol) {
          return await sql`SELECT * FROM ${sql(TABLE)} WHERE symbol=${symbol}`;
        }
        return [];
      })();
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };
  const create = async (row: Ticker) => {
    try {
      await sql`INSERT INTO ${sql(TABLE)} ${sql(from(row), ...COLUMNS)}`;
      return row;
    } catch (err) {
      return err;
    }
  };
  const find = async (req: { symbol: Symbol; ts: Date }) => {
    try {
      const rows = await sql`SELECT * FROM ${sql(TABLE)} WHERE symbol=${
        req.symbol
      } AND ts=${req.ts} LIMIT 1`;
      const found = first(rows);
      if (!found) {
        return error(
          ErrorName.NotFound,
          `Ticker not found for ${req.symbol} at ${req.ts}`
        );
      }
      return to(found);
    } catch (err) {
      return err;
    }
  };

  const clear = async () => {
    try {
      await sql` DELETE FROM ${sql(TABLE)}`;
    } catch (err) {
      return err;
    }
  };
  return {
    create,
    filter,
    find,
    clear,
  };
};
