import { Sign } from './constants'
export type BoardRow = {
  price: number;
  quantity: number;
  sign?: Sign;
}
export type Board = {
  symbol: string;
  exchange?: string;
  sell: BoardRow[];
  buy: BoardRow[];
  current: {
    price: number;
    time: Date;
    sign?: Sign;
  },
  overSellQuantity?: number;
  underBuyQuantity?: number;
}

export const Board = (props: Board) => {
  const { symbol, exchange, sell, buy, current, overSellQuantity, underBuyQuantity } = props
  return {
    symbol,
    sell,
    buy,
    current,
    overSellQuantity,
    underBuyQuantity,
  }
}
