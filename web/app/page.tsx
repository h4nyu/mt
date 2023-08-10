"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { last, chain } from "lodash";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/use-api";
import { BoardChart } from "@kgy/web/components/board-chart";
import { Board } from "@kgy/core/board";
import useSWR from "swr";

export default function Home() {
  const api = useApi();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code") ?? "8035.T";
  const [cursor, setCursor] = useState<Date | undefined>(undefined);
  const [boards, setBoards] = useState<Board[]>([]);
  const { data: nextBoards, error } = useSWR(
    `${code}-${cursor?.toISOString()}`,
    () =>
      api.board.read({
        code,
        cursor,
        limit: cursor ? 10 : 10000,
      }),
    {
      refreshInterval: cursor ? 1000: 0,
    },
  );
  if(nextBoards?.length){
    setCursor(last(nextBoards ?? [])?.time);
    setBoards([...boards, ...nextBoards].slice(0, 10000));
  }
  return <BoardChart boards={boards} />;
}
