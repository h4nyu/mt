import { KabusApi } from './kabus-api'


describe('KabusApi', () => {
  const setup = () => {
    const client = KabusApi({
      logger: console,
    })
    return { client }
  }
  describe('auth', () => {
    test("refleshToken", async () => {
      const { client } = setup()
      const res = await client.auth.refleshToken()
      if(res instanceof Error) throw res
        expect(client.auth.http.defaults.headers.common['X-API-KEY']).toBeTruthy()
    })
  })
  test("register", async () => {
    const { client } = setup()
    const res = await client.register({
      symbols: ['9433', '9437'] // 任天堂, グリー
    })
    if(res instanceof Error) throw res
  })
})
