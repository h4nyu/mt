import { nanoid } from "nanoid";
import { Interval } from ".";

export type Candle = {
  id: string;
  symbol: string;
  interval: Interval;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  date: Date;
};

export const Candle = (
  props: Omit<Candle, "id" | "time"> & { id?: string; time?: Date }
): Candle => {
  const id = props.id ?? nanoid();
  const date = props.date ?? new Date();
  const { open, close, high, low, volume, symbol, interval } = props;
  return {
    id,
    symbol,
    interval,
    open,
    close,
    high,
    low,
    volume,
    date,
  };
};
