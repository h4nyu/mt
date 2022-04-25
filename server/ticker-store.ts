import { Row, Sql } from "postgres";
import { Ticker } from "@kaguya/core/ticker";
import { first } from "lodash";
import { error, ErrorName } from "@kaguya/core/error";
import { Symbol } from "@kaguya/core";

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

  const last = async (req: { symbol: Symbol }) => {
    try {
      const rows = await sql`SELECT * FROM ${sql(
        TABLE
      )} ORDER BY ts ASC LIMIT 1`;
      return first(rows.map(to));
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
    last,
    clear,
  };
};
