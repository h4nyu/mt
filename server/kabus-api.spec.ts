import { KabusApi, parseBoard } from './kabus-api'
import fs from 'fs'


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

describe('parser', () => {
  const setup = () => {
    const jsonText = fs.readFileSync('../test-data/kabus-api/board.json', 'utf-8')
    const json = JSON.parse(jsonText)
    return { json }
  }
  test("parseBoard", () => {
    const { json } = setup()
    const board = parseBoard(json)
    expect(board.symbol).toBe('5401')
    expect(board.sell.length).toBe(10)
    expect(board.buy.length).toBe(10)
    expect(board.overSellQuantity).toBe(974900)
    expect(board.underBuyQuantity).toBe(756000)
  })
})
