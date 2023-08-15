import { Board } from "@kgy/core/board";
import Plot from "react-plotly.js";
import { last, max, min, sortBy, first } from "lodash";

const layout = {
  height: 250,
  width: 1024,
  showlegend: false,
  margin: {
    l: 70,
    r: 150,
    b: 35,
    t: 35,
    pad: 4
  },
};
const getLastAngle = (values: number[], window=20) => {
  const yLange = (max(values.slice(-window)) ?? NaN) - (min(values.slice(-window)) ?? Number.MAX_SAFE_INTEGER)
  const tan = (values[values.length - 1] - values[values.length - 2]) / (yLange || 1)
  return Math.atan(tan) * 180
}
const MA = (req: { values: number[], period: number }) => {
  const res = req.values.slice(req.period).map((_, i) => {
    return req.values.slice(i, i + req.period).reduce((a, b) => a + b, 0) / req.period
  })
  return [...Array(req.period).fill(NaN), ...res]
}
const checkCross = (values1: number[], values2: number[]) => {
  let last1 = values1[values1.length - 1]
  let last2 = values2[values2.length - 1]
  let last3 = values1[values1.length - 2]
  let last4 = values2[values2.length - 2]
  const diff1 = last1 - last3
  const diff2 = last2 - last4
  if (last1 > last2 && last3 < last4 && diff1 > 0 && diff2 > 0) {
    return "crossUp"
  }
  if (last1 < last2 && last3 > last4 && diff1 < 0 && diff2 < 0) {
    return "crossDown"
  }
  if(last1 > last2 && last3 < last4){
    return "up"
  }
  if(last1 < last2 && last3 > last4){
    return "down"
  }
  return ""
}

export const BoardChart = (props: { boards: Board[], code:string }) => {
  const boards = sortBy(props.boards, (board) => board.time)
  const times = boards.map((board) => board.time);
  const over = boards.map((board) => board.overQuantity ?? 0);
  const meanAsk = boards.map((board) => {
    return board.asks.reduce((a, b) => a + b.quantity * b.price, 0) / board.asks.reduce((a, b) => a + b.quantity, 0)
  })
  const meanBid = boards.map((board) => { 
    return board.bids.reduce((a, b) => a + b.quantity * b.price, 0) / board.bids.reduce((a, b) => a + b.quantity, 0)
  })
  const maxAskQuantity = boards.map((board) => first(sortBy(board.asks, (ask) => -ask.price))?.quantity ?? 0)
  const maxBidQuantity = boards.map((board) => first(sortBy(board.bids, (bid) => -bid.price))?.quantity ?? 0)
  const underValues = boards.map((board) => board.underQuantity ?? 0);
  const price = boards.map((board) => board.price ?? 0);
  const priceMA1 = MA({ values: price, period: 2 })
  const priceMA2 = MA({ values: price, period: 40 })
  const underMA1 = MA({ values: underValues, period: 20 })
  const underMA2 = MA({ values: underValues, period: 40 })
  const overMA1 = MA({ values: over, period: 20 }).map((v) => -v)
  const overMA2 = MA({ values: over, period: 40 }).map((v) => -v)
  const underOverDiff = underValues.map((v, i) => v - over[i])
  const underOverDiffMA1 = MA({ values: underOverDiff, period: 20 })
  const underOverDiffMA2 = MA({ values: underOverDiff, period: 40 })
  const angle = getLastAngle(priceMA1) + getLastAngle(underMA1) + getLastAngle(overMA1.map((v) => -v))
  return <>
    <div> over: {last(over)} under: {last(underValues)} </div>
    <div> price: {last(price)} </div>
    <div> angle: {angle} </div>
    <div> cross: {checkCross(overMA1, overMA2)} </div>
    <Plot data={[ 
      (() => {
        return {
          x: times,
          y: price,
          type: "scattergl" as const,
          mode: "markers",
          name: "price",
        } 
      })(),
      (() => {
        return {
          x: times,
          y: priceMA1,
          mode: "lines",
          line: {
            color: "red",
          },
        } 
      })(),
      (() => {
        return {
          x: times,
          y: priceMA2,
          mode: "lines",
          line: {
            color: "blue",
          },
        } 
      })(),
    ] as any[]} layout={{ 
      ...layout,
      } as any} 
    />
    <Plot data={
      [
      (() => {
        return {
          x: times,
          y: underOverDiffMA1,
          mode: "lines",
          line: {
            color: "red",
          }
        }
      })(),
      (() => {
        return {
          x: times,
          y: underOverDiffMA2,
          mode: "lines",
          line: {
            color: "blue",
          }
        }
      })(),

    ] as any[]} layout={{ 
      ...layout,
      } as any} 
    />
    <Plot data={[
      (() => {
        return {
          x: times,
          y: overMA1,
          type: "scattergl" as const,
          mode: "lines",
          line: {
            color: "red",
          },
          name: "over",
          color: 'red',
        };
      })(),
      (() => {
        return {
          x: times,
          y: overMA2,
          type: "scattergl" as const,
          mode: "lines",
          line: {
            color: "blue",
          },
          name: "over",
          color: 'red',
        };
      })()
    ] as any[]} layout={{ 
      ...layout,
      title: `${props.code} over`,
      } as any} 
    />
    <Plot data={[
      (() => {
        return {
          x: times,
          y: underMA1,
          mode: "lines",
          line: {
            color: "red",
          }
        }
      })(),
      (() => {
        return {
          x: times,
          y: underMA2,
          mode: "lines",
          line: {
            color: "blue",
          }
        }
      })(),
    ] as any[]} layout={{ 
      ...layout,
      title: `${props.code} under`,
      } as any} 
    />
  </>
};
