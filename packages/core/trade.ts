import { Order } from './order';

export type Trade = {
  id: string;
  entry?: Order;
  exit?: Order;
}

export const Trade = (props:Trade):Trade => {
  const { id, entry, exit } = props;
  return {
    id,
    entry,
    exit
  }
}
