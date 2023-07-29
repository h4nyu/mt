import { nanoid } from 'nanoid';
import { Action, OrderKind } from "@kgy/core/constants";




export type Order = {
  id: string
  symbol: string,
  kind: "MARKET" | "LIMIT", // 指値か成行か
  side: "BUY" | "SELL", // 買いか売りか
  price?: number // 指値の場合の価格
  quantity: number // 数量
  placedAt: Date // 注文した日時
}

export const Order = (
  props: Omit<Order, "id" | "createdAt"|"updatedAt"|"status"|"kind">&{
    id?: string
    status?: OrderStatus,
    action?: Action,
    createdAt?: Date
    updatedAt?: Date
  }
): Order => {
  const id = props.id || nanoid()
  const { symbol: symbolId, status, action, createdAt, updatedAt } = props
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
