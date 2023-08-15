import { Board } from "@kgy/core/board";
import Plot from "react-plotly.js";
import { last, max } from "lodash";

const layout = {
  height: 300,
  width: 1920,
  showlegend: false,
  margin: {
    l: 70,
    r: 140,
    b: 35,
    t: 35,
    pad: 4
  },
  
};
const MA = (req: { values: number[], period: number }) => {
  const res = req.values.slice(req.period).map((_, i) => {
    return req.values.slice(i, i + req.period).reduce((a, b) => a + b, 0) / req.period
  })
  return [...Array(req.period).fill(NaN), ...res]
}

export const BoardChart = (props: { boards: Board[], code:string }) => {
  const times = props.boards.map((board) => board.time);
  const overValues = props.boards.map((board) => board.overQuantity ?? 0);
  const underValues = props.boards.map((board) => board.underQuantity ?? 0);
  const underOverDiffValues = underValues.map((under, i) => under - overValues[i]);
  const priceValues = props.boards.map((board) => board.price ?? 0);
  const maxAskValues = props.boards.map((board) => max(board.asks.map((ask) => ask.price)) ?? 0);
  const maxBidValues = props.boards.map((board) => max(board.bids.map((bid) => bid.price)) ?? 0);
  const over = (() => {
    return {
      x: times,
      y: overValues.map((v) => -v),
      type: "scattergl" as const,
      mode: "markers",
      marker: {
        size: 3,
      },
      name: "over",
      color: 'red',
    };
  })();
  const ma1 = (() => {
    return {
      x: times,
      y: MA({ values: underValues, period: 20 }),
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "red",
      },
      name: "over",
      color: 'red',
    };
  })()
  const ma2 = (() => {
    return {
      x: times,
      y: MA({ values: underValues, period: 40 }),
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "blue",
      },
      name: "over",
      color: 'red',
    };
  })()
  const ma3 = (() => {
    return {
      x: times,
      y: MA({ values: overValues, period: 20 }).map((v) => -v),
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "red",
      },
      name: "over",
      color: 'red',
    };
  })()
  const ma4 = (() => {
    return {
      x: times,
      y: MA({ values: overValues, period: 40 }).map((v) => -v),
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "blue",
      },
      name: "over",
      color: 'red',
    };
  })()
  const under = (() => {
    return {
      x: times,
      y: underValues,
      type: "scattergl" as const,
      mode: "markers",
      marker: {
        size: 3,
      },
      name: "under",
    };
  })();
  const maxAsk = (() => {
    return {
      x: times,
      y: maxAskValues,
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "red",
      },
      name: "price",
    };
  })()
  const maxBid = (() => {
    return {
      x: times,
      y: maxBidValues,
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "blue",
      },
      name: "price",
    };
  })();
  const price = (() => {
    return {
      x: times,
      y: priceValues,
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "black",
      },
      name: "price",
      yaxis: 'y3',
    };
  })();
  return <>
    <div> over: {last(overValues)} under: {last(underValues)} </div>
    <div> over - under: {last(underOverDiffValues)} </div>
    <div> maxAsk: {last(maxAskValues)} </div>
    <div> maxBid: {last(maxBidValues)} </div>
    <div> price: {last(priceValues)} </div>
    <Plot data={[price, 
      maxAsk,
      maxBid,
    ] as any[]} layout={{ 
      ...layout,
      } as any} 
    />
    <Plot data={[over, ma3, ma4] as any[]} layout={{ 
      ...layout,
      title: `${props.code} over`,
      } as any} 
    />
    <Plot data={[under, ma1, ma2] as any[]} layout={{ 
      ...layout,
      title: `${props.code} under`,
      } as any} 
    />
  </>

};
