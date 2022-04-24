import { GmoCoin } from './gmo-coin';
import { Symbol, Interval } from "@kaguya/core"

describe('GmoCoin', () => {
  const gmoCoin = GmoCoin();
  test('status', async () => {
    const res = await gmoCoin.status()
    if (res instanceof Error) {
      throw res
    }
  });
  test('candles', async () => {
    const res = await gmoCoin.candles({
      symbol: Symbol.BTC,
      interval: Interval.FIVE_MINUTES,
      date: new Date('2022-01-01T00:00:00.000Z'),
    })
    if (res instanceof Error) {
      throw res
    }
    expect(res.length).toBeGreaterThan(0)
  });
});
