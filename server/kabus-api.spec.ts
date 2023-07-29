import { KabusApi } from './kabus-api'


describe('KabusApi', () => {
  const setup = () => {
    const client = KabusApi({
      logger: console,
    })
    return { client }
  }
  test("refleshToken", async () => {
    const { client } = setup()
    const res = await client.refleshToken()
    if(res instanceof Error) throw res
    expect(client.auth.token).not.toBe('')
  })
})
