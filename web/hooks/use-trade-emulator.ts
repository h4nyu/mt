import { useState} from 'react';

export const useTradeEmulator = () => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [position, setPosition] = useState<{ price: number, type: "LONG" | "SHORT" } | null>(null);
  const [profit, setProfit] = useState(0);
  const buy = () => {
    if(!currentPrice) return;
    if (position) {
      if (position?.type === "SHORT") {
        setProfit(profit => profit + position.price - currentPrice);
        setPosition(null);
      }
    }else{
      setPosition({ price: currentPrice, type: "LONG" });
    }
  }
  const sell = () => {
    if(!currentPrice) return;
    if (position?.type === "LONG") {
      setProfit(profit => profit + currentPrice - position.price);
      setPosition(null);
    }else{
      setPosition({ price: currentPrice, type: "SHORT" });
    }
  }
  return {
    profit,
    position,
    setCurrentPrice,
    sell,
    buy
  }
};
