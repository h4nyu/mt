import { Sign } from "@kgy/core/constants";
export type BoardRow = {
  price: number;
  quantity: number;
};
export const BoardRow = (props: BoardRow) => {
  const { price, quantity } = props;
  return { price, quantity };
};
export type Board = {
  code: string;
  exchange?: string;
  askSign?: Sign;
  bidSign?: Sign;
  asks: BoardRow[];
  bids: BoardRow[];
  price?: number;
  time: Date;
  sign?: Sign;
  overQuantity?: number;
  underQuantity?: number;
};

export const Board = (props: Board) => {
  const {
    code,
    exchange,
    overQuantity,
    underQuantity,
    askSign,
    bidSign,
    price,
    time,
    sign,
  } = props;
  const asks = props.asks.map(BoardRow);
  const bids = props.bids.map(BoardRow);
  return {
    code,
    asks,
    askSign,
    bids,
    bidSign,
    price,
    time,
    sign,
    overQuantity,
    underQuantity,
  };
};
