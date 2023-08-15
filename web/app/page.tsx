"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { addDays } from "date-fns";
import Image from "next/image";
import { last, chain } from "lodash";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/use-api";
import { BoardChart } from "@kgy/web/components/board-chart";
import { Board } from "@kgy/core/board";
import useSWR from "swr";

const CodeBoardChart = (props: { code: string }) => {
  const { code } = props;
  const api = useApi();
  const defaultCursor = addDays(new Date(), -2);
  const [cursor, setCursor] = useState<Date>(defaultCursor);
  const [boards, setBoards] = useState<Board[]>([]);
  const { data: nextBoards, error } = useSWR(
    `${code}-${cursor?.toISOString()}`,
    () =>
      api.board.read({
        code,
        cursor,
        limit: 100,
      }),
    {
      refreshInterval: 1000,
    },
  );
  if (nextBoards?.length) {
    setCursor(last(nextBoards ?? [])?.time ?? defaultCursor);
    setBoards(
      chain([...boards, ...nextBoards])
        .orderBy("time", "desc")
        .values()
        .slice(0, 10000),
    );
  }
  return (
    <>
      <BoardChart boards={boards} code={code} />;
    </>
  );
};

const Page = () => {
  const codes = ["8035.T", "9983.T", "9984.T"];
  return (
    <>
      {codes.map((code) => {
        return <CodeBoardChart key={code} code={code} />;
      })}
    </>
  );
};
export default Page;
