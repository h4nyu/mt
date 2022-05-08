import { TickerStore } from "./ticker-store";
import { Postgresql } from "./postgresql";
import { Ticker } from "@kaguya/core/ticker";
import { ErrorName } from "@kaguya/core/error";
import { Symbol } from "@kaguya/core";
import { range } from "lodash";

describe("order-store", () => {
  const sql = Postgresql();
  const store = TickerStore(sql);
  afterEach(async () => {
    await store.clear();
  });
  afterAll(async () => {
    await sql.end({ timeout: 5 });
  });

  test("create & find", async () => {
    const row = Ticker({
      symbol: Symbol.BTC_JPY,
      low: 9.0,
      ask: 10.0,
      bid: 9.1,
      last: 11.3,
      high: 12.0,
      volume: 100,
      ts: new Date(),
    });
    const created = await store.create(row);
    expect(created).toEqual(row);
    const filtered = await store.filter({ symbol: row.symbol });
    expect(filtered).toEqual([row]);
  });
  test("find", async () => {
    const symbol = Symbol.BTC_JPY;
    const rows = [
      Ticker({
        symbol,
        low: 9.0,
        ask: 10.0,
        bid: 9.1,
        last: 11.3,
        high: 12.0,
        volume: 100,
        ts: new Date(),
      }),
      Ticker({
        symbol,
        low: 9.0,
        ask: 10.0,
        bid: 9.1,
        last: 11.3,
        high: 12.0,
        volume: 100,
        ts: new Date(),
      }),
    ];
    for (const row of rows) {
      await store.create(row);
    }
    const found = await store.find({ symbol, ts: rows[1].ts });
    expect(found).toEqual(rows[1]);
  });
});
