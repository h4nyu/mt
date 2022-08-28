import { nanoid } from 'nanoid';
import { Action, OrderKind, SymbolId } from "@kgy/core/constants";


// TODO
export enum OrderStatus {
  New = 'New',
  Canceled = 'Canceled',
}

export type Order = {
  id: string
  symbolId: SymbolId,
  contractPrice?: number,
  status: OrderStatus,
  action: Action,
  createdAt: Date,
  updatedAt: Date
  kind: OrderKind
  price?: number
}
export const Order = (
  props: Omit<Order, "id" | "createdAt"|"updatedAt"|"status"|"action">&{
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
