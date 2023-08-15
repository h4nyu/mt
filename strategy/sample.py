from backtesting import Backtest, Strategy
from backtesting.lib import crossover, cross
from backtesting.test import SMA, GOOG
import pandas as pd
import random


class SmaCross(Strategy):
    def init(self) -> None:
        span = 10
        under_qty = self.data.underQuantity
        over_qty = self.data.overQuantity
        diff = under_qty - over_qty
        price = self.data.price
        self.price_ma1 = self.I(SMA, price, span)
        self.under_qty_ma1 = self.I(SMA, under_qty, span)
        self.diff_ma1 = self.I(SMA, -over_qty, span)
        self.diff_ma2 = self.I(SMA, -over_qty, span * 2)
        self.max_span = 100

    def next(self) -> None:
        ma1_diff = self.diff_ma1[-1] - self.diff_ma1[-2]
        ma2_diff = self.diff_ma2[-1] - self.diff_ma2[-2]
        if(len(self.trades)):
            print(self.trades[-1].__dict__)

        if self.diff_ma1[-1] > self.diff_ma2[-1] and self.diff_ma1[-2] < self.diff_ma2[-2]:
            self.buy()
        if self.diff_ma1[-1] < self.diff_ma2[-1] and self.diff_ma1[-2] > self.diff_ma2[-2]:
            self.sell()

df = pd.read_table(
    "../datasets/2023-08-11-export/8035.T/8035.T-2023-08-11T04-03-43.379Z.tsv"
)
df = df[~df["price"].isna()]
df["price"] = df["price"] / 1000
df["Open"] = df["price"]
df["Close"] = df["price"]
df["High"] = df["price"]
df["Low"] = df["price"]
df["Volume"] = 0
df["time"] = pd.to_datetime(df["time"])
df = df.set_index("time")
df = df[:10000]
# df = GOOG
# df["Volume"] = 0
# df["High"] = df["Close"]
# df["Low"] = df["Close"]
# df["Open"] = df["Close"]
# df = df[:100]


bt = Backtest(df, SmaCross, commission=0.000, exclusive_orders=True)
stats = bt.run()
print(stats)
# bt.plot()
