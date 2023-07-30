import { PrismaClient } from "./prisma/client"
import {nanoid} from 'nanoid'
import { BoardStore } from "./board-store.postgres"
import { Board } from "@kgy/core/board"

describe("BoardStore", () => {
  const setup = () => {
    const prisma = new PrismaClient()
    const boardStore = BoardStore({ prisma })
    const symbol = nanoid()
    return { prisma, boardStore, symbol }
  }
  test("write & read", async () => {
    const { boardStore, symbol } = setup()
    const board = Board({ 
      symbol,
      current: {
        price: 300.0,
        time: new Date(),
      },
      asks: [{
        price: 100,
        quantity: 10,
      }],
      bids: [{
        price: 100,
        quantity: 100,
      }]
    })
    const wErr = await boardStore.write([board])
    if(wErr instanceof Error) throw wErr;
    const read = await boardStore.read({
      symbols: [symbol],
    })
    if(read instanceof Error) throw read;
    console.log(JSON.stringify(read, null, 2))
    expect(read).toEqual([board])
  })
})
