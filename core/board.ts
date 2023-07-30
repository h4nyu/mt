import { Sign } from './constants'
export type BoardRow = {
  price: number;
  quantity: number;
}
export const BoardRow = (props: BoardRow) => {
  const { price, quantity } = props
  return { price, quantity }
}
export type Board = {
  symbol: string;
  exchange?: string;
  askSign?: Sign;
  bidSign?: Sign;
  asks: BoardRow[];
  bids: BoardRow[];
  current: {
    price: number;
    time: Date;
    sign?: Sign;
  },
  overQuantity?: number;
  underQuantity?: number;
}

export const Board = (props: Board) => {
  const { symbol, exchange, current, overQuantity, underQuantity, askSign, bidSign } = props
  const asks = props.asks.map(BoardRow)
  const bids = props.bids.map(BoardRow)
  return {
    symbol,
    asks,
    askSign,
    bids,
    bidSign,
    current,
    overQuantity,
    underQuantity,
  }
}
