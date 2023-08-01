import axios from "axios";
import { Logger } from "@kgy/core/logger";
import { Board } from "@kgy/core/board";
import WebSocket from "ws";
import { Err, ErrorName } from "@kgy/core/error";

export const parseBoardRow = (raw: any) => {
  return {
    price: raw.Price,
    quantity: raw.Qty,
  };
};
const encodeExchange = (exchange: string) => {
  if (exchange === "T") return 1; // 東証
  if (exchange === "M") return 3; // 名証
  if (exchange === "F") return 5; // 福証
  if (exchange === "O") return 6; // 札証
  return 1;
};
const decodeExchange = (exchange: number) => {
  if (exchange === 1) return "T"; // 東証
  if (exchange === 3) return "M"; // 名証
  if (exchange === 5) return "F"; // 福証
  if (exchange === 6) return "O"; // 札証
  return "T";
};
const encodeCode = (code: string) => {
  const [symbol, exchange] = code.split(".");
  if (!symbol || !exchange)
    return Err({
      name: ErrorName.ValidationError,
      message: `Invalid code: ${code}`,
    });
  const exchangeCode = encodeExchange(exchange);
  return {
    exchange: exchangeCode,
    symbol,
  };
};
const decodeCode = (req: { symbol: string; exchange: number }) => {
  const { symbol, exchange } = req;
  const exchangeCode = decodeExchange(exchange);
  return `${symbol}.${exchangeCode}`;
};

export const parseBoard = (raw: any) => {
  const exchange = decodeExchange(raw.Exchange);
  return Board({
    code: `${raw.Symbol}.${exchange}`,
    price: raw.CurrentPrice,
    time: new Date(raw.CurrentPriceTime),
    sign: raw.CurrentSign ?? undefined,
    asks: [
      raw.Sell1,
      raw.Sell2,
      raw.Sell3,
      raw.Sell4,
      raw.Sell5,
      raw.Sell6,
      raw.Sell7,
      raw.Sell8,
      raw.Sell9,
      raw.Sell10,
    ]
      .map(parseBoardRow)
      .filter((x) => x.price !== 0),
    askSign: raw.AskSign,
    bids: [
      raw.Buy1,
      raw.Buy2,
      raw.Buy3,
      raw.Buy4,
      raw.Buy5,
      raw.Buy6,
      raw.Buy7,
      raw.Buy8,
      raw.Buy9,
      raw.Buy10,
    ].map(parseBoardRow),
    bidSign: raw.BidSign,
    overQuantity: raw.OverSellQty,
    underQuantity: raw.UnderBuyQty,
  });
};
const handleError = (e: Error) => {
  if (axios.isAxiosError(e)) {
    return Err({
      name: e.response?.data?.Code ?? e.name,
      message: e.response?.data?.Message ?? e.message,
      prev: e,
    });
  }
  return e;
};

export const Auth = (props?: { logger?: Logger }) => {
  const http = axios.create({
    baseURL: `${process.env.KABUSAPI_URL}`,
  });
  const name = "Auth";
  props?.logger?.info({
    name,
    message: `Connect to ${process.env.KABUSAPI_URL}`,
  });
  const refleshToken = async () => {
    try {
      const res = await http.post("/token", {
        APIPassword: process.env.KABUSAPI_PASSWORD,
      });
      props?.logger?.info({
        message: `success to reflesh token`,
      });
      http.defaults.headers.common["X-API-KEY"] = res.data.Token;
    } catch (e) {
      return handleError(e);
    }
  };
  const getClient = async () => {
    if (!http.defaults.headers.common["X-API-KEY"]) {
      const err = await refleshToken();
      if (err) return err;
    }
    return http;
  };
  return {
    getClient,
    refleshToken,
    http,
  };
};
export const KabusApi = (props?: { logger?: Logger }) => {
  const name = "KabusApi";
  const auth = Auth(props);
  const register = async (req: { codes: string[] }) => {
    const { codes } = req;
    const http = await auth.getClient();
    if (http instanceof Error) return http;
    try {
      const payload: { Symbols: { Symbol: string; Exchange: number }[] } = {
        Symbols: [],
      };
      for (const code of codes) {
        const encoded = encodeCode(code);
        if (encoded instanceof Error) return encoded;
        payload.Symbols.push({
          Symbol: encoded.symbol,
          Exchange: encoded.exchange,
        });
      }
      const res = await http.put("/register", payload);
      return res.data.RegistList.map((x) => x.Symbol);
    } catch (e) {
      return handleError(e);
    }
  };
  const unregister = async (req: { codes: string[] }) => {
    const { codes } = req;
    const http = await auth.getClient();
    const payload: { Symbols: { Symbol: string; Exchange: number }[] } = {
      Symbols: [],
    };
    for (const code of codes) {
      const encoded = encodeCode(code);
      if (encoded instanceof Error) return encoded;
      payload.Symbols.push({
        Symbol: encoded.symbol,
        Exchange: encoded.exchange,
      });
    }
    if (http instanceof Error) return http;
    try {
      const res = await http.put("/unregister", payload);
      return res.data.RegistList.map((x) => x.Symbol);
    } catch (e) {
      return e;
    }
  };
  const unregisterAll = async () => {
    const http = await auth.getClient();
    if (http instanceof Error) return http;
    try {
      const res = await http.put("/unregister/all");
      return res.data.RegistList.map((x) => x.Symbol);
    } catch (e) {
      return e;
    }
  };
  type SubscribeFn = (req: { board: Board }) => void;

  const subscribe = async (req: { codes: string[]; handler: SubscribeFn }) => {
    const { codes, handler } = req;
    const regErr = await register({ codes });
    if (regErr instanceof Error) return regErr;
    props?.logger?.info({
      name,
      message: `Register ${codes.join(", ")}`,
    });

    const ws = new WebSocket(process.env.KABUSAPI_WS_URL ?? "");
    return new Promise((resolve, reject) => {
      ws.on("open", () => {
        props?.logger?.info({
          name,
          message: `Connect to ${process.env.KABUSAPI_WS_URL}`,
        });
      });
      ws.on("message", (data) => {
        props?.logger?.info({
          name,
          message: `Receive message from ${process.env.KABUSAPI_WS_URL}`,
        });
        const board = parseBoard(JSON.parse(data.toString()));
        handler({ board });
      });
      ws.on("close", () => {
        props?.logger?.info({
          name,
          message: `Disconnect from ${process.env.KABUSAPI_WS_URL} and reconnecting...`,
        });
      });
      ws.on("error", (err) => {
        props?.logger?.error({
          name,
          message: `${err.message}`,
        });
      });
    });
  };

  return {
    register,
    unregister,
    unregisterAll,
    subscribe,
    auth,
  };
};
