export enum TransactionKind  {
  BUY: 'BUY',
  SELL: 'SELL'
}
export enum OrderType {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT'
}

export type Transaction = {
  id: string;
  symbol: string;
  kind: TransactionKind;
  amount: number;
  price: number;
  orderType: OrderType;
  limitPrice?: number;
  executedPrice: number;
  orderedAt: Date;
  executedAt: Date;
}








