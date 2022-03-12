import { Order } from "./order";
export type Position = {
  id: string;
  entry?: Order;
  exit?: Order;
}
