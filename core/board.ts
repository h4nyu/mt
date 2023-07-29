export type BoardRow = {
  price: number;
  amount: number;
}
export type Board = {
  symbol: string;
  exchange?: string;
  sell: BoardRow[];
  buy: BoardRow[];
  current: {
    price: number;
    time: Date;
  },
  over?: {
    sellAmount: number;
    buyAmount: number;
    sign: number;
  },
  ask?: {
    amount: number;
    price: number;
    time: Date;
  },
  bid?: {
    amount: number;
    price: number;
    time: Date;
  }
}
export const Board = (props: Board) => {
  const { symbol, exchange, sell, buy, current, over, ask, bid } = props
  return {
    symbol,
    sell,
    buy,
    current,
    ask, 
    bid,
  }
}
