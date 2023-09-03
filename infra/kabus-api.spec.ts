import { KabusApi, parseBoard } from "./kabus-api";
import { Sign } from "@kgy/core/constants";
import fs from "fs";

const describeIf = (() => {
  if (process.env.KABUS_API_TOKEN && process.env.ENVIRONMENT === "local")
    return describe;
  return describe.skip;
})();

describeIf("KabusApi", () => {
  const setup = () => {
    const client = KabusApi({
      logger: console,
    });
    return { client };
  };
  describe("auth", () => {
    test("refleshToken", async () => {
      const { client } = setup();
      const res = await client.auth.refleshToken();
      if (res instanceof Error) throw res;
      expect(
        client.auth.http.defaults.headers.common["X-API-KEY"],
      ).toBeTruthy();
    });
  });
  test("register", async () => {
    const { client } = setup();
    const codes = ["9987.T"];
    const res = await client.register({
      codes,
    });
    if (res instanceof Error) throw res;
  });
  test("unregister", async () => {
    const { client } = setup();
    const codes = ["9987.T"];
    const res = await client.unregister({
      codes,
    });
    if (res instanceof Error) throw res;
  });
});

describe("parser", () => {
  const setup = () => {
    const jsonText = fs.readFileSync(
      "../test-data/kabus-api/board.json",
      "utf-8",
    );
    const json = JSON.parse(jsonText);
    return { json };
  };
  test("parseBoard", () => {
    const { json } = setup();
    const board = parseBoard(json);
    expect(board.code).toBe("5401.T");
    expect(board.asks?.length).toBe(10);
    expect(board.bids?.length).toBe(10);
    expect(board.bidSign).toBe(Sign.GENERAL_QUOTATION);
    expect(board.overQuantity).toBe(974900);
    expect(board.underQuantity).toBe(756000);
    expect(board.volume).toBe(4571500);
    expect(board.changePreviousClosePrice).toBe(1360);
    expect(board.changePreviousCloseRate).toBe(129.77);
    expect(board.previousClosePrice).toBe(1048);
    expect(board.previousCloseTime).toBeDefined();
    expect(board.openPrice).toBe(2380);
    expect(board.openTime).toBeDefined();
    expect(board.highPrice).toBe(2418);
    expect(board.highTime).toBeDefined();
    expect(board.lowPrice).toBe(2370);
    expect(board.lowTime).toBeDefined();
    expect(board.volume).toBe(4571500);
    expect(board.volumeTime).toBeDefined();
    expect(board.marketOrderSellQuantity).toBe(0);
    expect(board.marketOrderBuyQuantity).toBe(0);
  });
});
