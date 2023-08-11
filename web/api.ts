import axios from "axios";
import { Board } from "@kgy/core/board";
export const Api = () => {
  const http = axios.create();
  const board = (() => {
    const read = async (params: { code: string; limit?: number, cursor?:Date, interval?:number }):Promise<Board[]> => {
      const res = await http.get(`/api/board/`, {
        params,
      });
      return res.data.map((x:any) => Board({
        ...x,
        time: new Date(x.time),
      }));
    };
    return {
      read,
    };
  })();
  return {
    board,
  };
};
