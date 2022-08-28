import { GmoCoin } from "./gmo-coin";
import { Interval } from "@kgy/core";
import { SymbolId } from "@kgy/core/constants";
import { range } from "lodash";

describe("GmoCoin", () => {
  const gmoCoin = GmoCoin();
  test("status", async () => {
    const res = await gmoCoin.status();
    if (res instanceof Error) {
      throw res;
    }
  });
  test("candles", async () => {
    const res = await gmoCoin.candles({
      symbolId: SymbolId.BTC,
      interval: Interval.FIVE_MINUTES,
      date: new Date("2022-01-01T00:00:00.000Z"),
    });
    if (res instanceof Error) {
      throw res;
    }
    expect(res.length).toBeGreaterThan(0);
  });

  test("ticker", async () => {
    const res = await gmoCoin.ticker({
      symbolId: SymbolId.BTC,
    });
    if (res instanceof Error) {
      throw res;
    }
  });

  test("subscribe", async () => {
    gmoCoin.subscribe(SymbolId.BTC, console.log);
    await new Promise((f) => setTimeout(f, 1000));
  });
});
