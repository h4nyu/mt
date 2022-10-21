import { OrderStore } from "./order-store";
import { Postgresql } from "./postgresql";
import { Order } from "@kgy/core/order";
import { ErrorName } from "@kgy/core/error";
import { SymbolId, OrderKind } from "@kgy/core/constants";
import { range } from "lodash";

describe("order-store", () => {
  const sql = Postgresql();
  const store = OrderStore(sql);
  afterEach(async () => {
    await store.clear();
  });
  afterAll(async () => {
    await sql.end({ timeout: 5 });
  });

  test.skip("create & find", async () => {
    const order = Order({
      kind: OrderKind.LIMIT,
      symbolId: SymbolId.BTC_JPY,
      price: 100,
    });
    const saved = await store.create(order);
    expect(saved).toEqual(order);
    const finded = await store.find({ id: saved.id });
    expect(finded).toEqual(order);
  });

  test.skip("create & filter", async () => {
    const orders = range(10).map((i) =>
      Order({
        kind: OrderKind.LIMIT,
        symbolId: SymbolId.ETH_JPY,
        price: 100,
      }),
    );
    for (const order of orders) {
      await store.create(order);
    }
    const filtered = await store.filter({
      symbolId: SymbolId.ETH_JPY,
    });
    expect(filtered).toEqual(orders);
  });

  test.skip("find should return NotError", async () => {
    const finded = await store.find({ id: "not-exist-id" });
    expect(finded instanceof Error && finded.name).toBe(ErrorName.NotFound);
  });
});
