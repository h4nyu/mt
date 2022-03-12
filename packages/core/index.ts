import { Candle } from './candle';
import { SymbolId } from './symbol';

export type CandleStore = {
  filter: (req: { symbolId?:string }) => Candle[],
}

export type Exchange = {
  buy: (req: {symbolId: SymbolId, amount: number}) => Promise<void|Error>,
  sell: (req: {symbolId: SymbolId, amount: number}) => Promise<void|Error>,
}
