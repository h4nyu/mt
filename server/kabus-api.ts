import axios from 'axios'
import { Logger } from "@kgy/core/logger"

import { Board } from "@kgy/core/board"

export const parseBoardRow = (raw: any) => {
  return {
    price: raw.Price,
    amount: raw.Qty,
  }
}
export const parseBoard = (raw: any) => {
  return Board({
    symbol: raw.Symbol,
    current: {
      price: raw.CurrentPrice,
      time: new Date(raw.CurrentPriceTime),
    },
    sell:[raw.Sell1, raw.Sell2, raw.Sell3, raw.Sell4, raw.Sell5, raw.Sell6, raw.Sell7, raw.Sell8, raw.Sell9, raw.Sell10].map(parseBoardRow),
    buy:[raw.Buy1, raw.Buy2, raw.Buy3, raw.Buy4, raw.Buy5, raw.Buy6, raw.Buy7, raw.Buy8, raw.Buy9, raw.Buy10].map(parseBoardRow),
  })
}

export const Auth = (props?: {
  logger?: Logger
}) => {
  const http = axios.create({
    baseURL: `${process.env.KABUSAPI_URL}`,
  })
  props?.logger?.info({
    module: 'KabusApi',
    message: `Connect to ${process.env.KABUSAPI_URL}`
  })
  const refleshToken = async () => {
    try{
      const res = await http.post('/token', {
        APIPassword: process.env.KABUSAPI_PASSWORD,
      })
      http.defaults.headers.common['X-API-KEY'] = res.data.Token
    }catch(e){
      return e
    }
  }
  const getClient = async () => {
    if(!http.defaults.headers.common['X-API-KEY']){
      const err = await refleshToken()
      if(err) return err
    }
    return http
  }
  return {
    getClient,
    refleshToken,
    http,
  }
}
export const KabusApi = (props?: {
  logger?: Logger
}) => {
  const auth = Auth(props)
  const register = async (req: {
    symbols: string[]
  }) => {
    const { symbols } = req
    const http = await auth.getClient()
    if(http instanceof Error) return http
    try{
      const res = await http.put('/register', { 
        Symbols: symbols.map((symbol) => {
          return {
            Symbol: symbol,
            Exchange: 1, // 東証
          }
        }),
      })
      return
    }
    catch(e){
      return e
    }
  }
  return {
    register,
    auth,
  }
}
