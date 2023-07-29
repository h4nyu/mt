import { Sign } from './constants'
export type BoardRow = {
  price: number;
  quantity: number;
}
export type Board = {
  symbol: string;
  exchange?: string;
  sellSign?: Sign;
  buySign?: Sign;
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
  const { symbol, exchange, sell, buy, current, overSellQuantity, underBuyQuantity, sellSign, buySign } = props
  return {
    symbol,
    sell,
    sellSign,
    buy,
    buySign,
    current,
    overSellQuantity,
    underBuyQuantity,
  }
}
