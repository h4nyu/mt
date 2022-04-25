import { Symbol } from ".";

export type Ticker = {
  symbol: Symbol;
  ask: number;
  bid: number;
  high: number;
  last: number;
  low: number;
  volume: number;
  ts: Date;
};

export const Ticker = (props: Ticker): Ticker => {
  const { symbol, ask, bid, high, last, low, ts, volume } = props;
  return { symbol, ask, bid, high, last, low, ts, volume };
};
