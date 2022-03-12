import { nanoid } from 'nanoid';
export type Candle = {
  id: string
  open: number
  close: number
  high: number
  low: number
  volume: number
  time: Date
}

export const Candle = (props: Omit<Candle, "id"|"time"> & { id?:string, time?:Date}): Candle => {
  const id = props.id ?? nanoid();
  const time = props.time ?? new Date();
  const { open, close, high, low, volume } = props;
  return {
    id,
    open,
    close,
    high,
    low,
    volume,
    time
  }
}
