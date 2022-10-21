import { Trader } from "./mock";
import { Action } from "@kgy/core/constants";

describe("mock", () => {
  const setup = () => {
    const trader = Trader();
    return {
      trader,
    };
  };
  test("mock always returns the stay", async () => {
    const { trader } = setup();
    const order = await trader.action({
      position: [],
      tickers: [],
    });
    if (order instanceof Error) {
      throw order;
    }
    expect(order.action).toBe(Action.STAY);
  });
});
