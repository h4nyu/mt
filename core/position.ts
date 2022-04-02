import { Order } from "./order";
export type Position = {
  id: string;
  entry: Order;
  exit?: Order;
}

export const Position = (props: Position):Position => {
  const { id, entry, exit } = props;
  return {
    id,
    entry,
    exit
  }
}
