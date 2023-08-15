import lightgbm as lgb
import pandas as pd

SHIFT = 10
FOLD = 4

def add_feats(df) -> pd.DataFrame:
    df['time'] = pd.to_datetime(df['time'])
    df["time_diff"] = df["time"].diff().dt.total_seconds()
    price_ma_20 = df["price"].rolling(20).mean()
    df["price_ma_5"] = df["price"].rolling(5).mean()
    df["price_shift_1"] = df["price"].shift(1)
    df["price_shift_2"] = df["price"].shift(2)
    df["price_shift_3"] = df["price"].shift(3)
    df["price_shift_4"] = df["price"].shift(4)
    df["price_shift_5"] = df["price"].shift(5)
    df["price_shift_6"] = df["price"].shift(6)
    df["price_shift_7"] = df["price"].shift(7)
    df["price_shift_8"] = df["price"].shift(8)
    df["price_shift_9"] = df["price"].shift(9)
    df["price_shift_10"] = df["price"].shift(10)
    df["price_ma_20"] = price_ma_20
    df["price_ma_20_diff"] = price_ma_20 - df["price_ma_20"].shift(1)
    df["underQuantity_ma_5"] = df["underQuantity"].rolling(5).mean()
    df["underQuantity_ma_20"] = df["underQuantity"].rolling(20).mean()
    df["underQuantity_ma_40"] = df["underQuantity"].rolling(40).mean()
    df["overQuantity_ma_20"] = df["overQuantity"].rolling(20).mean()
    df["overQuantity_ma_5"] = df["overQuantity"].rolling(5).mean()
    df["overQuantity_ma_40"] = df["overQuantity"].rolling(40).mean()
    df["max_ask_quantity"] = df[[f"asks_{i}_quantity" for i in range(10)]].max(axis=1)
    df["max_bid_quantity"] = df[[f"bids_{i}_quantity" for i in range(10)]].max(axis=1)
    df["max_ask_quantity_diff"] = df["max_ask_quantity"] - df["max_ask_quantity"].shift(1)
    df["max_bid_quantity_diff"] = df["max_bid_quantity"] - df["max_bid_quantity"].shift(1)
    df["latest_10_max_price"] = df["price"].rolling(10).max()
    df["latest_10_min_price"] = df["price"].rolling(10).min()
    df["latest_30_max_price"] = df["price"].rolling(30).max()
    df["latest_30_min_price"] = df["price"].rolling(30).min()
    df["latest_100_max_price"] = df["price"].rolling(100).max()
    df["latest_100_min_price"] = df["price"].rolling(100).min()
    return df

x_cols = [
    "price",
    "underQuantity",
    "overQuantity",
    "price_ma_5",
    "price_ma_20",
    "latest_10_max_price",
    "latest_10_min_price",
    "latest_30_max_price",
    "latest_30_min_price",
    "latest_100_max_price",
    "latest_100_min_price",
    "price_shift_1",
    "price_shift_2",
    "price_shift_3",
    "price_shift_4",
    "price_shift_5",
    "price_shift_6",
    "price_shift_7",
    "price_shift_8",
    "price_shift_9",
    "price_shift_10",
    "price_ma_20_diff",
    "underQuantity_ma_5",
    "underQuantity_ma_20",
    "underQuantity_ma_40",
    "overQuantity_ma_5",
    "overQuantity_ma_20",
    "overQuantity_ma_40",
    "max_ask_quantity",
    "max_bid_quantity",
    *[f"asks_{i}_price" for i in range(10)],
    *[f"asks_{i}_quantity" for i in range(10)],
    *[f"bids_{i}_price" for i in range(10)],
    *[f"bids_{i}_quantity" for i in range(10)],
    "time_diff",
]
y_cols = [f"price_diff_mean_in_{SHIFT}s"]

def rename_cols(df):
    new_cols = {}
    for col in df.columns:
        new_col = col.replace(".", "_").replace("[", "_").replace("]", "")
        new_cols[col] = new_col
    df = df.rename(columns=new_cols)
    return df

def add_shifed_price(df, shift):
    df[f"price_{shift}s"] = df["price"].shift(-shift)
    df[f"price_ma_5"] = df["price"].rolling(5).mean()
    df[f"price_ma_5_{shift}s"] = df[f"price_ma_5"].shift(-shift)
    df[f"price_diff_ma_5_{shift}s"] = df[f"price_ma_5_{shift}s"] - df["price_ma_5"]
    df[f"price_ma_10"] = df["price"].rolling(10).mean()
    df[f"price_ma_10_{shift}s"] = df[f"price_ma_10"].shift(-shift)
    df[f"price_diff_ma_10_{shift}s"] = df[f"price_ma_5_{shift}s"] - df["price_ma_5"]
    df[f"price_diff_{shift}s"] = df[f"price_{shift}s"] - df["price"]
    df[f"price_max_in_{shift}s"] = df["price"].rolling(shift).max().shift(-shift)
    df[f"price_mean_in_{shift}s"] = df["price"].rolling(shift).mean().shift(-shift)
    df[f"price_diff_mean_in_{shift}s"] = df[f"price_mean_in_{shift}s"] - df["price"].rolling(shift).mean()
    return df

if __name__ == "__main__":
    SEED = 42


    train_df = pd.concat([
        pd.read_table(f"../datasets/2023-08-11-export/9983.T/9983.T-2023-08-11T04-02-37.637Z.tsv"),
        pd.read_table(f"../datasets/2023-08-11-export/9984.T/9984.T-2023-08-11T04-00-13.397Z.tsv"),
        pd.read_table(f"../datasets/2023-08-11-export/7267.T/7267.T-2023-08-11T04-05-09.543Z.tsv"),
        pd.read_table(f"../datasets/2023-08-11-export/7203.T/7203.T-2023-08-11T04-05-25.674Z.tsv"),
        pd.read_table(f"../datasets/2023-08-11-export/7974.T/7974.T-2023-08-11T04-04-01.901Z.tsv"),
    ])
    test_df = pd.read_table(f"../datasets/2023-08-11-export/8035.T/split/test_{FOLD}.tsv")

    train_df = rename_cols(train_df)
    test_df = rename_cols(test_df)


    train_x = train_df
    train_x = add_feats(train_x)[x_cols]
    train_y = add_shifed_price(train_df, SHIFT)[y_cols]
    test_x = test_df
    test_x = add_feats(test_x)[x_cols]
    test_y = add_shifed_price(test_df, SHIFT)[y_cols]

    print(train_x.head(SHIFT + 1), train_y.head(SHIFT + 1))
# check length
    print(len(train_x), len(train_y), len(test_x), len(test_y))

    lgb_train = lgb.Dataset(train_x, train_y)
    lgb_eval = lgb.Dataset(test_x, test_y, reference=lgb_train)

    params = {
        "task": "train",
        "boosting": "gbdt",
        "objective": "regression",
        "random_state": 42,  # 乱数シード
        "num_leaves": 100,
        "learnnig_rage": 0.001,
        "metric": {"l1"},
        "use_missing": False,
        "zero_as_missing": True,
        "verbose": -1,
        "predict_disable_shape_check": True,
    }
    verbose_eval = 0

    gbm = lgb.train(
        params,
        train_set=lgb_train,
        valid_sets=lgb_eval,
        callbacks=[
            lgb.early_stopping(stopping_rounds=1000, verbose=True),  # early_stoppingコールバック関数
            lgb.log_evaluation(verbose_eval),
        ],
    )
    importances = []
    for col, importance in zip(train_x.columns, gbm.feature_importance()):
        importances.append((col, importance))
    importances.sort(key=lambda x: x[1], reverse=True)
    for col, importance in importances:
        print(f"{col}: {importance}")

    y_pred = gbm.predict(test_x)
# print feature importances by name
    test_x["pred"] = y_pred + test_x["price"]
    # test_x["pred"] = y_pred
    test_x[['price', 'pred']][100:200].plot().get_figure().savefig("pred.png")
# save model
    gbm.save_model(f"model_{SHIFT}s.txt")
