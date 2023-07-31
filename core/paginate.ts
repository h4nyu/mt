export type Paginate<T> = AsyncGenerator<T, void, void>;

export const Paginate = <T, U>(props: {
  fn: (req: { cursor?: U; limit: number }) => Promise<T[] | Error>;
  getCursor: (row: T) => U;
  chunkSize: number;
}) => {
  return async function* (req?: { cursor?: U; limit?: number }) {
    let i = 0;
    let hasNext = true;
    const totalLimit = req?.limit;
    let cursor = req?.cursor;
    while (hasNext) {
      const rows = await props.fn({
        cursor,
        limit: props.chunkSize,
      });
      if (rows instanceof Error) {
        yield rows;
        return;
      }
      if (rows.length == 0) {
        hasNext = false;
      }
      for (const row of rows) {
        yield row;
        i++;
        if (totalLimit && i >= totalLimit) {
          hasNext = false;
          break;
        }
        cursor = props.getCursor(row); // last row.id is next cursor
      }
    }
    return;
  };
};
