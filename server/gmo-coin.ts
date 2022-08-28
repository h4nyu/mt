import axios from "axios";
import { Interval, Logger } from "@kgy/core";
import { SymbolId } from "@kgy/core/constants";
import { Candle } from "@kgy/core/candle";
import { Ticker } from "@kgy/core/ticker";
import * as datefns from "date-fns";
import WebSocket from "ws";

const mapInterval = (value: Interval) => {
  switch (value) {
    case Interval.ONE_MINUTE:
      return "1min";
    case Interval.FIVE_MINUTES:
      return "5min";
    case Interval.FIFTEEN_MINUTES:
      return "15min";
    case Interval.THIRTY_MINUTES:
      return "30min";
    case Interval.ONE_HOUR:
      return "1hour";
    case Interval.FOUR_HOURS:
      return "4hour";
    case Interval.EIGHT_HOURS:
      return "8hour";
    case Interval.TWELVE_HOURS:
      return "12hour";
    case Interval.ONE_DAY:
      return "1day";
    case Interval.ONE_WEEK:
      return "1week";
    case Interval.ONE_MONTH:
      return "1month";
    default:
      return "1min";
  }
};
const decodeTicker = (str: string, symbolId: SymbolId):Ticker|Error => {
  if(str.startsWith("ERR")) {
    return new Error(str);
  }
  const obj = JSON.parse(str);
  const ts = new Date(obj.timestamp);
  return Ticker({
    ...obj,
    ts,
  })
}

export const GmoCoin = (props?: { 
  apiKey?: string; 
  apiSecretKey?: string,
  logger?:Logger
}) => {
  const apiKey = props?.apiKey ?? process.env.GMO_COIN_API_KEY;
  const apiSecretKey = props?.apiSecretKey ?? process.env.GMO_COIN_SECRET_KEY;
  const publicEndpoint = axios.create();
  publicEndpoint.defaults.baseURL = "https://api.coin.z.com/public";

  const ws = new WebSocket("wss://api.coin.z.com/ws/public/v1");
  const status = async () => {
    try {
      const res = await publicEndpoint.get("/v1/status");
      return res.data.data.status;
    } catch (e) {
      return e;
    }
  };
  const candles = async (req: {
    symbolId: SymbolId;
    interval: Interval;
    date: Date;
  }) => {
    try {
      const dateStirng = (() => {
        if (
          [
            Interval.ONE_MINUTE,
            Interval.FIVE_MINUTES,
            Interval.FIFTEEN_MINUTES,
            Interval.THIRTY_MINUTES,
            Interval.ONE_HOUR,
          ].includes(req.interval)
        ) {
          return datefns.format(req.date, "yyyyMMdd");
        }
        return datefns.format(req.date, "yyyy");
      })();
      const res = await publicEndpoint.get("/v1/klines", {
        params: {
          symbol: req.symbolId,
          interval: mapInterval(req.interval),
          date: dateStirng,
        },
      });
      return res.data.data.map((x) => {
        return Candle({
          open: parseInt(x.open),
          high: parseInt(x.close),
          low: parseInt(x.high),
          close: parseInt(x.low),
          volume: parseInt(x.volume),
          symbolId: req.symbolId,
          interval: req.interval,
          date: new Date(parseInt(x.openTime)),
        });
      });
    } catch (e) {
      return e;
    }
  };

  const ticker = async (req: { symbolId: SymbolId }) => {
    try {
      const res = await publicEndpoint.get("/v1/ticker", {
        params: {
          symbol: req.symbolId,
        },
      });
      return res.data.data.map((x) => {
        return Ticker({
          symbolId: req.symbolId,
          ask: parseInt(x.ask),
          bid: parseInt(x.bid),
          last: parseInt(x.last),
          high: parseInt(x.high),
          low: parseInt(x.low),
          volume: parseInt(x.volume),
          ts: new Date(x.timestamp),
        });
      });
    } catch (e) {
      return e;
    }
  };
  const subscribe = (
    symbolId: SymbolId,
    handler: (ticker: Ticker) => void,
  ) => {
    try {
      ws.on("open", () => {
        const message = JSON.stringify({
          command: "subscribe",
          channel: "ticker",
          symbolId,
        });
        ws.send(message);
        props?.logger?.info(`subscribed to ${symbolId}`);
      });
      ws.on("message", async (data) => {
        props?.logger?.info(`received message for ${symbolId} ${data}`);
        const ticker = decodeTicker(data.toString(), symbolId);
        if(ticker instanceof Error) {
          return
        }
        handler(ticker)
      });
    } catch (e) {
      return e;
    }
  };
  return {
    status,
    candles,
    ticker,
    subscribe,
  };
};
