from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG
import pandas as pd
import random

class SmaCross(Strategy):
    def init(self):
        # price = self.data.price
        # price = self.data.price
        price = self.data.Close
        self.ma1 = self.I(SMA, price, 10)
        self.ma2 = self.I(SMA, price, 20)

    def next(self):
        if crossover(self.ma1, self.ma2):
            self.buy()
        elif crossover(self.ma2, self.ma1):
            self.sell()
df = pd.read_table('../datasets/2023-08-11-export/8035.T/8035.T-2023-08-11T04-03-43.379Z.tsv')
df = df[~df["price"].isna()]
df['price'] = df['price'] / 1000
df["Open"] = df["price"]
df["Close"] = df["price"]
df["High"] = df["price"]
df["Low"] = df["price"]
df["Volume"] = 0
df['time'] = pd.to_datetime(df['time'])
df = df.set_index('time')
df.drop(['code'], axis=1, inplace=True)
df = df[:5000]
# df = GOOG
# df["Volume"] = 0
# df["High"] = df["Close"]
# df["Low"] = df["Close"]
# df["Open"] = df["Close"]
# df = df[:100]

print(df.describe())

bt = Backtest(df, SmaCross, commission=.000, exclusive_orders=True)
stats = bt.run()
print(stats)
bt.plot()
