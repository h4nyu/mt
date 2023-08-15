"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { add } from "date-fns";
import Image from "next/image";
import { last, chain, max } from "lodash";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/use-api";
import { BoardChart } from "@kgy/web/components/board-chart";
import { Board } from "@kgy/core/board";
import useSWR from "swr";
import { useTradeEmulator } from "../hooks/use-trade-emulator";

const CodeBoardChart = (props: {
  code: string;
  speed?: number;
  fromDate: Date;
}) => {
  const { code } = props;
  const api = useApi();
  const defaultCursor = props.fromDate
  const tradeEmulator = useTradeEmulator();
  const [cursor, setCursor] = useState<Date>(defaultCursor);
  const [boards, setBoards] = useState<Board[]>([]);
  const { data: nextBoards, error } = useSWR(
    `${code}-${cursor?.toISOString()}`,
    () =>
      api.board.read({
        code,
        cursor,
        limit: 1,
      }),
    {
      refreshInterval: 500 / (props.speed ?? 1),
    },
  );
  if(nextBoards?.length){
    setCursor(
      max([last(nextBoards ?? [])?.time, cursor, defaultCursor]) ?? defaultCursor,
    );
    setBoards([...boards, ...nextBoards].slice(-1000));
    // setBoards([...boards, ...nextBoards].slice(10000));
    const currentPrice = last(nextBoards ?? [])?.price
    if(currentPrice){
      tradeEmulator.setCurrentPrice(currentPrice);
    }
  }
  return <>
    <button onClick={() => tradeEmulator.buy()}>Buy</button>
    <button onClick={() => tradeEmulator.sell()}>Sell</button>
    <div> position.price: { tradeEmulator.position?.type } </div>
    <div> position.type: { tradeEmulator.position?.price } </div>
    <div> profit: { tradeEmulator.profit } </div>
    <BoardChart boards={boards} code={code} />;
  </>
}

const Page = () => {
  const [fromDate, setFromDate] = useState<Date>(add(new Date(), {
    minutes: -10,
  }));

  const codes = [
    "8035.T",
    // "9983.T",
    // "9984.T",
  ]
  return (
    <>
      <input type="date" value={fromDate?.toISOString().slice(0, 10)} onChange={(e) => setFromDate(new Date(e.target.value))} />
      {
        codes.map((code) => {
          return (
            <CodeBoardChart 
              key={code}
              code={code} 
              fromDate={fromDate}
            />
          )
        })
      }
    </>
  );
};
export default Page;
