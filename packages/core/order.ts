
export enum OrderKind {
  Limit = 'Limit',
  Market = 'Market',
  Stop = 'Stop',
}


export type Order = {
  id: string
  createdAt: Date
  contractPrice?: number
} | {
  kind: OrderKind.Limit,
  price: number
} | {
  kind: OrderKind.Market
} | {
  kind: OrderKind.Stop,
  price: number
}
