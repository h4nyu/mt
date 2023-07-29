import { PrismaClient } from "./prisma/client"
import { BoardStore } from "./board-store.postgres"
import { Board } from "@kgy/core/board"

describe("BoardStore", () => {
  const setup = () => {
    const prisma = new PrismaClient()
    const boardStore = BoardStore({ prisma })
    return { prisma, boardStore }
  }
  test("create", async () => {
    const { boardStore } = setup()
    const board = Board({ 
      symbol: "AAPL",
      current: {
        price: 300.0,
        time: new Date(),
      },
      sell: [{
        price: 100,
        quantity: 10,
      }],
      buy: [{
        price: 100,
        quantity: 100,
      }]
    })
    const res = await boardStore.create([board])
    if(res instanceof Error) throw res

  })
})
