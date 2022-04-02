import axios from 'axios';
import { Symbol, Interval } from "@kaguya/core"
import { Candle } from '@kaguya/core/candle';
import * as datefns from 'date-fns'

const mapInterval = (value:Interval) => {
  switch (value) {
    case Interval.ONE_MINUTE:
      return '1min';
    case Interval.FIVE_MINUTES:
      return '5min';
    case Interval.FIFTEEN_MINUTES:
      return '15min';
    case Interval.THIRTY_MINUTES:
      return '30min';
    case Interval.ONE_HOUR:
      return '1hour';
    case Interval.FOUR_HOURS:
      return '4hour';
    case Interval.EIGHT_HOURS:
      return '8hour';
    case Interval.TWELVE_HOURS:
      return '12hour';
    case Interval.ONE_DAY:
      return '1day';
    case Interval.ONE_WEEK:
      return '1week';
    case Interval.ONE_MONTH:
      return '1month';
    default:
      return '1min';
  }
}


export const GmoCoin = (props?: {
  apiKey?: string;
  apiSecretKey?: string;
}) => {
  const apiKey = props?.apiKey ?? process.env.GMO_COIN_API_KEY;
  const apiSecretKey = props?.apiSecretKey ?? process.env.GMO_COIN_SECRET_KEY;
  const publicEndpoint = axios.create();
  publicEndpoint.defaults.baseURL = 'https://api.coin.z.com/public';

  const status = async () => {
    try{
      const res = await publicEndpoint.get('/v1/status');
      return res.data.data.status;
    }catch(e){
      return e
    }
  };
  const candles = async (req: {
    symbol: Symbol
    interval: Interval,
    date: Date,
  }) => {
    try{
      const dateStirng = (() => {
        if([Interval.ONE_MINUTE, Interval.FIVE_MINUTES, Interval.FIFTEEN_MINUTES, Interval.THIRTY_MINUTES, Interval.ONE_HOUR].includes(req.interval)){
          return datefns.format(req.date, 'yyyyMMdd')
        }
        return datefns.format(req.date, 'yyyy')
      })()
      const res = await publicEndpoint.get('/v1/klines', {
        params: {
          symbol: req.symbol,
          interval: mapInterval(req.interval),
          date: dateStirng,
        }
      });
      return res.data.data.map(x => {
        return Candle({
          open: parseInt(x.open),
          high: parseInt(x.close),
          low: parseInt(x.high),
          close: parseInt(x.low),
          volume: parseInt(x.volume),
          symbol: req.symbol,
          interval: req.interval,
          date: new Date(parseInt(x.openTime)),
        })
      });
    }catch(e){
      console.log(e)
      return e
    }
  };
  return {
    status,
    candles,
  }
}
