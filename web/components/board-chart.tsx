import { Board } from "@kgy/core/board";
import Plot from "react-plotly.js";

const layout = {
  height: 600,
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

export const BoardChart = (props: { boards: Board[], code:string }) => {
  const times = props.boards.map((board) => board.time);
  const over = (() => {
    return {
      x: times,
      y: props.boards.map((board) => board.overQuantity ?? 0),
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "red",
      },
      name: "over",
      color: 'red',
    };
  })();
  const under = (() => {
    return {
      x: times,
      y: props.boards.map((board) => board.underQuantity ?? 0),
      type: "scattergl" as const,
      mode: "lines",
      line: {
        color: "blue",
      },
      name: "under",
      yaxis: 'y2',
    };
  })();
  const price = (() => {
    return {
      x: times,
      y: props.boards.map(
        (board) => board.price ?? 0,
      ),
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
    <Plot data={[over, under, price] as any[]} layout={{ 
      ...layout,
      title: props.code,
      xaxis: {domain: [0.0, 0.95]},
      yaxis: {
        title: 'over',
        side: 'right',
        fixedrange: true,
        position: 1.0,
        color: 'red',
      },
      yaxis2: {
        title: 'under',
        side: 'right',
        fixedrange: true,
        overlaying: 'y',
        position: 0.95,
        color: 'blue',
      },
      yaxis3: {
        title: 'price',
        side: 'left',
        fixedrange: true,
        overlaying: 'y',
      },
      } as any} 
    />
  </>

};
