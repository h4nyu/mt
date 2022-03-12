import { Candle } from './candle';
import { SymbolId } from './symbol';
import { Order } from './order';

export type CandleStore = {
  filter: (req: { symbolId?:string }) => Candle[],
}

export type Exchange = {
  order:(req: Omit<Order, 'id'>) => Promise<Order|Error>,
}
