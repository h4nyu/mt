import { GmoCoin } from './gmo-coin';

describe('GmoCoin', () => {
  const gmoCoin = GmoCoin();
  test('status', async () => {
    const res = await gmoCoin.status()
    if (res instanceof Error) {
      throw res
    }
  });
});
