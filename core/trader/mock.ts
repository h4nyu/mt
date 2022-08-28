import { Action, SymbolId, OrderKind } from '@kgy/core/constants';
import { Order } from '@kgy/core/order';


export const Trader = (option?: {
  symbolId?:SymbolId,
  orderKind?: OrderKind,
}) => {
  const symbolId = option?.symbolId ?? SymbolId.BTC;
  const kind = option?.orderKind ?? OrderKind.MARKET;
  const next = async (_) => {
    return Order({
      symbolId,
      kind: OrderKind.MARKET,
      action: Action.STAY,
    })
  }
  return {
    next
  }
}
