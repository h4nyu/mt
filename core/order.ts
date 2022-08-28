import { nanoid } from 'nanoid';
import { Action } from "@kgy/core/constants";

export enum OrderKind {
  Limit = 'Limit',
  Market = 'Market',
  Stop = 'Stop',
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
  action: Action,
  createdAt: Date,
  updatedAt: Date
  kind: OrderKind
  price?: number
}
export const Order = (
  props: Omit<Order, "id" | "createdAt"|"updatedAt"|"status"|"side">&{
    id?: string
    status?: OrderStatus,
    action?: Action,
    createdAt?: Date
    updatedAt?: Date
  }
): Order => {
  const id = props.id ?? nanoid();
  const createdAt = props.createdAt ?? new Date();
  const updatedAt = props.updatedAt ?? createdAt;
  const status = props.status ?? OrderStatus.New;
  const action = props.action ?? Action.STAY;
  const { kind, price, symbolId } = props;
  return {
    id,
    symbolId,
    kind,
    status,
    action,
    price,
    createdAt,
    updatedAt,
  }
}
