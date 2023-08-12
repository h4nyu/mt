from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG
import pandas as pd
import random


class SmaCross(Strategy):
    def init(self) -> None:
        # price = self.data.price
        # price = self.data.price
        # self.under_ma1 = self.I(SMA, self.data.underQuantity, 30)
        # self.under_ma2 = self.I(SMA, self.data.underQuantity, 50)

        # self.over_ma1 = self.I(SMA, self.data.overQuantity, 30)
        # self.over_ma2 = self.I(SMA, self.data.overQuantity, 50)
        # tgt = self.data.underQuantity - self.data.overQuantity
        tgt = self.data.underQuantity - self.data.overQuantity
        self.ma1 = self.I(SMA, tgt, 30)
        self.ma2 = self.I(SMA, tgt, 60)

    def next(self) -> None:
        if crossover(self.ma1, self.ma2):
            self.buy()
        elif crossover(self.ma2, self.ma1):
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
df = df[:5000]
# df = GOOG
# df["Volume"] = 0
# df["High"] = df["Close"]
# df["Low"] = df["Close"]
# df["Open"] = df["Close"]
# df = df[:100]


bt = Backtest(df, SmaCross, commission=0.000, exclusive_orders=True)
stats = bt.run()
print(stats)
bt.plot()
