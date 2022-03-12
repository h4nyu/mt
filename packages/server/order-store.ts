import { Row, Sql } from "postgres";
import { Order } from "@kaguya/core/order"

const TABLE = "orders"
const COLUMNS = [
  "id",
  "contract_price",
  "kind",
  "status",
  "side",
  "price",
  "updated_at",
  "created_at",
]

export const OrderStore = (sql: Sql<any>) => {
  const from = (r: Order): Row => {
    return {
      id: r.id,
      contract_price: r.contractPrice,
      kind: r.kind,
      status: r.status,
      side: r.side,
      price: r.price,
      updated_at: r.updatedAt,
      created_at: r.createdAt,
    };
  };
  const create = async (row: Order) => {
    try {
      await sql` INSERT INTO ${sql(TABLE)} ${sql(from(row),...COLUMNS)}`;
    } catch (err) {
      return err;
    }
  }
  return {
  };
};
