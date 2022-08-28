import { SymbolId } from "@kgy/core/constants";

export type Ticker = {
  symbolId: SymbolId;
  ask: number;
  bid: number;
  high: number;
  last: number;
  low: number;
  volume: number;
  ts: Date;
};

export const Ticker = (props: Ticker): Ticker => {
  const { symbolId, ask, bid, high, last, low, ts, volume } = props;
  return { symbolId, ask, bid, high, last, low, ts, volume };
};
