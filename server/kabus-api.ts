import axios from 'axios'
import { Logger } from "@kgy/core/logger"

const Auth = (props?: {
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
    symbol: string[]
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
