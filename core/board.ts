export type BoardRow = {
  price: number;
  amount: number;
}
export type Board = {
  symbol: string;
  sell: BoardRow[];
  buy: BoardRow[];
  current: {
    price: number;
    time: Date;
  },
  over: {
    sellAmount: number;
    buyAmount: number;
    sign: number;
  },
  ask: {
    amount: number;
    price: number;
    time: Date;
  },
  bid: {
    amount: number;
    price: number;
    time: Date;
  }
}
