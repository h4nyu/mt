import { nanoid } from 'nanoid';

export enum OrderKind {
  Limit = 'Limit',
  Market = 'Market',
  Stop = 'Stop',
}

export enum SideKind {
  Buy = 'Buy',
  Sell = 'Sell',
}

// TODO
export enum OrderStatus {
  New = 'New',
  Canceled = 'Canceled',
}

export type Order = {
  id: string
  symbolId: string,
  contractPrice?: number,
  status: OrderStatus,
  side: SideKind,
  createdAt: Date,
  updatedAt: Date
  kind: OrderKind
  price?: number
}
export const Order = (
  props: Omit<Order, "id" | "createdAt"|"updatedAt"|"status"|"side">&{
    id?: string
    status?: OrderStatus,
    side?: SideKind,
    createdAt?: Date
    updatedAt?: Date
  }
): Order => {
  const id = props.id ?? nanoid();
  const createdAt = props.createdAt ?? new Date();
  const updatedAt = props.updatedAt ?? createdAt;
  const status = props.status ?? OrderStatus.New;
  const side = props.side ?? SideKind.Buy;
  const { kind, price, symbolId } = props;
  return {
    id,
    symbolId,
    kind,
    status,
    side,
    price,
    createdAt,
    updatedAt,
  }
}
