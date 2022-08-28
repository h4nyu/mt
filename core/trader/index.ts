import { Position } from '@kgy/core/position';
import { Order } from '@kgy/core/order';
import { Ticker } from '@kgy/core/ticker';
import { Action } from '@kgy/core/constants';

export type Trader = {
  next: (state: {
    tickers: Ticker[];
    posisions: Position[];
  }) => Promise<Order | Error>;
}
