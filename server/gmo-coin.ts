import axios from 'axios';

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
  return {
    status,
  }
}
