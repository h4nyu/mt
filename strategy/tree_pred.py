import lightgbm as lgb
import pandas as pd
from tree import add_feats, x_cols, rename_cols, FOLD, SHIFT

df = pd.read_table(f"../datasets/2023-08-11-export/8035.T/8035.T-2023-08-11T04-03-43.379Z.tsv")[:100]
df = rename_cols(df)
df = add_feats(df)[x_cols]
lgb_model = lgb.Booster(model_file=f'model_{SHIFT}s.txt')

pred = lgb_model.predict(df)
df["pred"] = df["price"] + pred
df[['price', 'pred']].plot().get_figure().savefig("pred.png")
