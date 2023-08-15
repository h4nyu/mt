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

  changePreviousClosePrice?: number; //前日比
  changePreviousCloseRate?: number; //前日比率

  previousClosePrice?: number; //前日終値日付
  previousCloseTime?: Date; //前日終値日付

  openPrice?: number; //始値
  openTime?: Date; //始値時刻

  highPrice?: number; //高値
  highTime?: Date; //高値時刻

  lowPrice?: number; //安値
  lowTime?: Date; //安値時刻

  volume?: number; //出来高
  volumeTime?: Date; //出来高時刻

  marketOrderSellQuantity?: number; //売成行数量
  marketOrderBuyQuantity?: number; //買成行数量
};

export const Board = (props: Board): Board => {
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
    changePreviousClosePrice,
    changePreviousCloseRate,
    previousClosePrice,
    previousCloseTime,
    openPrice,
    openTime,
    highPrice,
    highTime,
    lowPrice,
    lowTime,
    volume,
    volumeTime,
    marketOrderSellQuantity,
    marketOrderBuyQuantity,
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
    changePreviousClosePrice,
    changePreviousCloseRate,
    previousClosePrice,
    previousCloseTime,
    openPrice,
    openTime,
    highPrice,
    highTime,
    lowPrice,
    lowTime,
    volume,
    volumeTime,
    marketOrderSellQuantity,
    marketOrderBuyQuantity,
  };
};
