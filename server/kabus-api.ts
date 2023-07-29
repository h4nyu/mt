import axios from 'axios'
import { Logger } from "@kgy/core/logger"
export const KabusApi = (props?: {
  logger?: Logger
}) => {
  console.log(process.env.KABUSAPI_URL)
  const http = axios.create({
    baseURL: `${process.env.KABUSAPI_URL}`,
  })
  props?.logger?.info({
    module: 'KabusApi',
    message: `Connect to ${process.env.KABUSAPI_URL}`
  })
  const auth = {
    token: '',
  }
  const refleshToken = async () => {
    try{
      const res = await http.post('/token', {
        APIPassword: process.env.KABUSAPI_PASSWORD,
      })
      auth.token = res.data.Token
    }catch(e){
      return e
    }
  }
  return {
    refleshToken,
    auth,
  }

}
