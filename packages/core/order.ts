
export enum OrderKind {
  Limit = 'Limit',
  Market = 'Market',
  Stop = 'Stop',
}

export enum PositionKind {
  Long = 'Long',
  Short = 'Short',
}

// TODO
export enum OrderStatus {
  New = 'New',
  Canceled = 'Canceled',
}

export type Order = {
  id: string
  createdAt: Date
  positionKind: PositionKind
  contractPrice?: number,
  status: OrderStatus,
} | {
  kind: OrderKind.Limit,
  price: number
} | {
  kind: OrderKind.Market
} | {
  kind: OrderKind.Stop,
  price: number
}
