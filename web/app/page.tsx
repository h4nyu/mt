"use client";
import { useSearchParams } from "next/navigation";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/use-api";
import { BoardChart } from "@kgy/web/components/board-chart";
import useSWR from "swr";

export default function Home() {
  const api = useApi();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code") ?? "8035.T";
  const { data: boards, error } = useSWR(
    code,
    () =>
      api.board.read({
        code,
        limit: 1000,
      }),
    {
      refreshInterval: 1000,
    },
  );

  return <BoardChart boards={boards ?? []} />;
}
