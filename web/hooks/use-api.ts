import { useMemo } from "react";
import { Api } from "@kgy/web/api";

export const useApi = () => {
  const api = useMemo(() => {
    return Api();
  }, []);
  return api;
};
