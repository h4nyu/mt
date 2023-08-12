import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from typing_extensions import Annotated
from pathlib import Path
import glob
import pandas as pd
import typer

app = typer.Typer()


@app.command()
def split(
    dataset_dir: Annotated[str, typer.Option()],
    code: Annotated[str, typer.Option()],
) -> None:
    tscv = TimeSeriesSplit(gap=10)
    code_dir = f"{dataset_dir}/{code}"
    tsv_file = glob.glob(f"{code_dir}/*.tsv").pop()
    df = pd.read_table(tsv_file)
    df = df[~df["price"].isna()]
    df["future_price"] = df["price"].shift(-1)
    print(df[["time", "price", "future_price"]].head())
    output_dir = f"{code_dir}/split/"
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    for i, (train_index, test_index) in enumerate(tscv.split(df)):
        train_df = df.iloc[train_index]
        test_df = df.iloc[test_index]
        train_df.to_csv(f"{output_dir}/train_{i}.tsv", sep="\t", index=False)
        test_df.to_csv(f"{output_dir}/test_{i}.tsv", sep="\t", index=False)


if __name__ == "__main__":
    app()
