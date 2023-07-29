import { PrismaClient,Prisma } from './prisma/client'
import { Board } from '@kgy/core/board'
import { BoardStore as IBoardStore } from '@kgy/core/interfaces'

export const BoardStore = (props: {
  prisma: PrismaClient
}) => {
  const create: IBoardStore["create"] = async (req) => {
    const rows:Prisma.BoardCreateManyInput[] = req.map((board: Board) => { 
      return { 
        symbol: board.symbol,
        exchange: board.exchange ?? null,
        currentTime: board.current.time,
        currentPrice: board.current.price,
        sellSign: board.sellSign,
        buySign: board.buySign,
        overSellQuantity: board.overSellQuantity,
        underBuyQuantity: board.underBuyQuantity,
      } 
    })
    try{
      await props.prisma.board.createMany({
        data: rows
      })
    }catch(e){
      return e
    }
  }
  return {
    create
  }
}
