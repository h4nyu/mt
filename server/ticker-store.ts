import { Row, Sql } from "postgres";
import { Ticker } from "@kgy/core/ticker";
import { first } from "lodash";
import { error, ErrorName } from "@kgy/core/error";
import { SymbolId } from "@kgy/core/constants";

const TABLE = "tickers";
const COLUMNS = ["symbol_id", "ask", "bid", "last", "high", "low", "volume", "ts"];

export const TickerStore = (sql: Sql<any>) => {
  const to = (r: Row): Ticker => {
    return Ticker({
      symbolId: r.symbol_id,
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
      symbol_id: r.symbolId,
      ask: r.ask,
      bid: r.bid,
      last: r.last,
      volume: r.volume,
      high: r.high,
      low: r.low,
      ts: r.ts,
    };
  };

  const filter = async (req: { symbolId?: SymbolId }) => {
    try {
      const rows = await (async () => {
        const { symbolId } = req;
        if (symbolId) {
          return await sql`SELECT * FROM ${sql(TABLE)} WHERE symbol_id=${symbolId}`;
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
  const find = async (req: { symbolId: SymbolId; ts: Date }) => {
    try {
      const rows = await sql`SELECT * FROM ${sql(TABLE)} WHERE symbol_id=${
        req.symbolId
      } AND ts=${req.ts} LIMIT 1`;
      const found = first(rows);
      if (!found) {
        return error(
          ErrorName.NotFound,
          `Ticker not found for ${req.symbolId} at ${req.ts}`
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
