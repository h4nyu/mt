import { Candle } from './candle';
import { SymbolId } from './symbol';
import { Order } from './order';

export type CandleStore = {
  filter: (req: { symbolId?:string }) => Candle[],
}

export type OrderStore = {
  find: (req: {id:string}) => Promise<Order|Error>,
  create: (order: Order) => Promise<Order|Error>,
  filter: (req: { symbolId?:string }) => Promise<Order[]|Error>,
}

export type ExchangeStatue = "OPEN" | "PREOPEN" | "MAINTENANCE"

export type Exchange = {
  order:(req: Omit<Order, 'id'>) => Promise<Order|Error>,
}
