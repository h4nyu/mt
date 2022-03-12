import { Row, Sql } from "postgres";
import { Order } from "@kaguya/core/order"
import { first } from "lodash";
import { error, ErrorName } from "@kaguya/core/error";


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
  const to = (r: Row): Order => {
    return Order({
      id: r.id,
      contractPrice: r.contract_price ?? undefined,
      kind: r.kind,
      status: r.status,
      side: r.side,
      price: r.price ?? undefined,
      updatedAt: r.updated_at,
      createdAt: r.created_at,
    });
  };

  const from = (r: Order): Row => {
    return {
      id: r.id,
      contract_price: r.contractPrice ?? null,
      kind: r.kind,
      status: r.status,
      side: r.side,
      price: r.price ?? null,
      updated_at: r.updatedAt,
      created_at: r.createdAt,
    };
  };
  const find = async (req: {id:string}) => {
    try {
      const rows = await (async () => {
        return await sql`SELECT * FROM ${sql(TABLE)} WHERE id=${req.id}`;
      })()
      const row = first(rows.map(to))
      if(row === undefined) {
        return error(
          ErrorName.OrderNotFound,
          `Order with id ${req.id} not found`
        )
      }
      return row
    } catch (err) {
      return err;
    }
  }
  const create = async (row: Order) => {
    try {
      await sql` INSERT INTO ${sql(TABLE)} ${sql(from(row),...COLUMNS)}`;
      return row
    } catch (err) {
      return err;
    }
  }
  return {
    find,
    create,
  };
};
