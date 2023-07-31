import { chain, range } from "lodash";
import { nanoid } from "nanoid";
import { Paginate } from "./paginate";

type Row = { id: string };
describe("Paginate", () => {
  const setup = () => {
    const tenantId = nanoid();
    return {
      tenantId,
    };
  };

  test("should return all items", async () => {
    const { tenantId } = setup();
    const rows = range(10).map((i) => {
      return {
        id: `${i}`,
        tenantId,
      };
    });
    const filterFn = async (req: {
      cursor?: string;
      limit: number;
      tenantId: string;
    }) => {
      return chain(rows)
        .filter((x) => x.tenantId === req.tenantId)
        .orderBy("id")
        .filter((x) => x.id > (req?.cursor ?? ""))
        .take(req.limit)
        .value();
    };
    const paginate = Paginate({
      fn: (req) =>
        filterFn({
          tenantId,
          cursor: req.cursor,
          limit: req.limit,
        }),
      getCursor: (x: Row) => x.id,
      chunkSize: 2,
    });
    const acc: (Row | Error)[] = [];
    for await (const row of paginate()) {
      acc.push(row);
    }
    expect(acc).toEqual(rows);
  });

  test("when error orrured", async () => {
    const filterFn = jest
      .fn()
      .mockResolvedValueOnce(new Error("error"))
      .mockResolvedValueOnce([
        {
          id: "c",
        },
        {
          id: "d",
        },
      ]);

    const paginate = Paginate({
      fn: filterFn,
      chunkSize: 2,
      getCursor: (x: Row) => x.id,
    });
    const acc: (Row | Error)[] = [];
    for await (const row of paginate()) {
      acc.push(row);
    }
    expect(acc).toEqual([new Error("error")]);
  });

  test("when cursor and limit are specified", async () => {
    const { tenantId } = setup();
    const rows = range(10).map((i) => {
      return {
        id: `${i}`,
        tenantId,
      };
    });
    const cursor = "1";
    const limit = 3;
    const filterFn = async (req: {
      cursor?: string;
      limit: number;
    }): Promise<Row[]> => {
      return chain(rows)
        .orderBy("id")
        .filter((x) => x.id > (req?.cursor ?? ""))
        .take(req.limit)
        .value();
    };
    const paginate = Paginate({
      fn: (req) =>
        filterFn({
          cursor: req.cursor,
          limit: req.limit,
        }),
      getCursor: (x: Row) => x.id,
      chunkSize: 2,
    });
    const acc: (Row | Error)[] = [];
    for await (const row of paginate({
      cursor,
      limit,
    })) {
      acc.push(row);
    }
    expect(acc).toEqual(rows.slice(2, 2 + limit)); // 2, 3, 4
  });
});
