import { Candle } from './candle';
import { SymbolId } from './symbol';

export type CandleStore = {
  filter: (req: { symbolId?:string }) => Candle[],
}
