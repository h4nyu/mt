import { nanoid } from "nanoid";
import { SymbolId } from "@kgy/core/constants";
import { Interval } from ".";

export type Candle = {
  id: string;
  symbolId: SymbolId;
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
  const { open, close, high, low, volume, symbolId, interval } = props;
  return {
    id,
    symbolId,
    interval,
    open,
    close,
    high,
    low,
    volume,
    date,
  };
};
