import { Candle } from "./candle";
import { Order } from "./order";
import { Ticker } from "./ticker";

export enum Interval {
  ONE_MINUTE = "ONE_MINUTE",
  FIVE_MINUTES = "FIVE_MINUTES",
  FIFTEEN_MINUTES = "FIFTEEN_MINUTES",
  THIRTY_MINUTES = "THIRTY_MINUTES",
  ONE_HOUR = "ONE_HOUR",
  FOUR_HOURS = "FOUR_HOURS",
  EIGHT_HOURS = "EIGHT_HOURS",
  TWELVE_HOURS = "TWELVE_HOURS",
  ONE_DAY = "ONE_DAY",
  ONE_WEEK = "ONE_WEEK",
  ONE_MONTH = "ONE_MONTH",
}

export enum Symbol {
  BTC = "BTC",
  BTC_JPY = "BTC_JPY",
  ETH_JPY = "ETH_JPY",
  XRP_JPY = "XRP_JPY",
  LTC_JPY = "LTC_JPY",
}

export type CandleStore = {
  filter: (req: { symbolId?: string }) => Candle[];
};

export type OrderStore = {
  find: (req: { id: string }) => Promise<Order | Error>;
  create: (order: Order) => Promise<Order | Error>;
  filter: (req: { symbolId?: string }) => Promise<Order[] | Error>;
};

export type ExchangeStatus = "OPEN" | "PREOPEN" | "MAINTENANCE";

export type Exchange = {
  status: () => Promise<ExchangeStatus | Error>;
  ticker: (req: {
    symbol: Symbol;
    interval: Interval;
    data: Date;
  }) => Promise<Candle[] | Error>;
  order: (req: Omit<Order, "id">) => Promise<Order | Error>;
};

export type TickerStore = {
  create: (row: Ticker) => Promise<Ticker | Error>;
  find: (req: { symbol: Symbol; ts: Date }) => Promise<Ticker | Error>;
};

export type Logger = {
  info: (msg: string) => void;
  error: (msg: string) => void;
};
