import axios from "axios";
export const Api = () => {
  const http = axios.create();
  const board = (() => {
    const read = async (params: { code: string; limit?: number }) => {
      const res = await http.get(`/api/board/`, {
        params,
      });
      return res.data;
    };
    return {
      read,
    };
  })();
  return {
    board,
  };
};
