import { Ticker } from "@kaguya/core/ticker";
import { TickerStore, Logger } from "@kaguya/core";
import { ErrorName } from "@kaguya/core/error";

export type CreateFn = (req: Ticker) => Promise<Ticker | Error>;

export const CreateFn = (props: {
  store: {
    ticker: TickerStore;
    logger?: Logger;
  };
}): CreateFn => {
  return async (req: Ticker) => {
    const prev = props.store.ticker.find(req);
    if (prev instanceof Error && prev.name !== ErrorName.NotFound) {
      return prev;
    }
    const created = await props.store.ticker.create(req);
    if (created instanceof Error) {
      return created;
    }
    props.store.logger?.info(
      `Created ticker ${created.symbol} at ${created.ts}`
    );
    return created;
  };
};
