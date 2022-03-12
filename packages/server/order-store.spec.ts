import { OrderStore } from "./order-store"
import { Postgresql } from "./postgresql"
import { Order, OrderKind } from "@kaguya/core/order"
import { ErrorName } from "@kaguya/core/error"

describe("order-store", () => {
  const sql = Postgresql()
  const store = OrderStore(sql)
  afterAll(async () => {
    await sql.end({ timeout: 5 });
  });
  test("create & find", async () => {
    const order = Order({
      kind: OrderKind.Limit,
      price: 100,
    })
    const saved = await store.create(order)
    expect(saved).toEqual(order)
    const finded = await store.find({id: saved.id})
    expect(finded).toEqual(order)
  });

  test("find should return NotError", async () => {
    const finded = await store.find({id: "not-exist-id"})
    expect(finded instanceof Error && finded.name).toBe(ErrorName.OrderNotFound)
  });
});
