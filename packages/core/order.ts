
export enum OrderKind {
  Limit = 'Limit',
  Market = 'Market',
  Stop = 'Stop',
}

export enum PositionKind {
  Long = 'Long',
  Short = 'Short',
}

export type Order = {
  id: string
  createdAt: Date
  positionKind: PositionKind
} | {
  kind: OrderKind.Limit,
  price: number
} | {
  kind: OrderKind.Market
} | {
  kind: OrderKind.Stop,
  price: number
}
