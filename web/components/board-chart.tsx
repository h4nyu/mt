import { Board } from "@kgy/core/board";
import Plot from "react-plotly.js";

const layout = {
  yaxis: { title: "Simple Contour Plot Axis" },
  yaxis2: { title: "Line and Scatter Plot Axis" },
  autosize: true,
};

export const BoardChart = (props: { boards: Board[] }) => {
  const over = (() => {
    return {
      x: props.boards.map((board) => board.time),
      y: props.boards.map((board) => board.overQuantity ?? 0),
      mode: "lines+markers",
      name: "over",
    };
  })();
  const under = (() => {
    return {
      x: props.boards.map((board) => board.time),
      y: props.boards.map((board) => board.underQuantity ?? 0),
      mode: "lines+markers",
      name: "under",
    };
  })();
  const diff = (() => {
    return {
      x: props.boards.map((board) => board.time),
      y: props.boards.map(
        (board) => (board.underQuantity ?? 0) - (board.overQuantity ?? 0),
      ),
      mode: "lines+markers",
      name: "diff",
    };
  })();

  return <Plot data={[over, under, diff]} layout={layout} />;
};
