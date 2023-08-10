import { Board } from "@kgy/core/board";
import Plot from "react-plotly.js";

const layout = {
  height: 300,
  width: 800,
  margin: {
    l: 50,
    r: 0,
    b: 50,
    t: 0,
    pad: 4
  },
  
};

export const BoardChart = (props: { boards: Board[] }) => {
  const times = props.boards.map((board) => board.time);
  const over = (() => {
    return {
      x: times,
      y: props.boards.map((board) => board.overQuantity ?? 0),
      mode: "markers",
      name: "over",
    };
  })();
  const under = (() => {
    return {
      x: times,
      y: props.boards.map((board) => board.underQuantity ?? 0),
      mode: "markers",
      name: "under",
    };
  })();
  const diff = (() => {
    return {
      x: times,
      y: props.boards.map(
        (board) => (board.underQuantity ?? 0) - (board.overQuantity ?? 0),
      ),
      mode: "markers",
      name: "diff",
    };
  })();
  const price = (() => {
    return {
      x: times,
      y: props.boards.map(
        (board) => board.price,
      ),
      mode: "markers",
      name: "price",
    };
  })();
  return <>
    <Plot data={[over]} layout={layout} />
    <Plot data={[under]} layout={layout} />
    <Plot data={[diff]} layout={layout} />
    <Plot data={[price]} layout={layout} />
  </>

};
