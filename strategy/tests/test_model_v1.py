import torch
from model_v1 import BoardDataset, preprocess, ModelV1
import pandas as pd


class TestPreprocess:
    def test_preprocess(self) -> None:
        tsv_path = "./test_data/8035.T-2023-08-11T04-03-43.379Z.tsv"
        df = pd.read_table(tsv_path)
        df = preprocess(df)
        for col in df.columns:
            if "Quantity" in col:
                assert df[col].max() <= 1.0
            elif "ask" in col or "bid" in col:
                assert df[col].max() <= 1.0


class TestBoardDataset:
    def prepare(self) -> BoardDataset:
        print("setup")
        tsv_path = "./test_data/8035.T-2023-08-11T04-03-43.379Z.tsv"
        df = pd.read_table(tsv_path)
        df = preprocess(df)
        dataset = BoardDataset(
            df=df,
        )
        return dataset

    def test_board_dataset(self) -> None:
        dataset = self.prepare()
        sample = dataset[0]
        before = sample["before"]
        after = sample["after"]
        assert before.shape == (1, dataset.before_window_size, 22)
        assert after.shape == (1, dataset.after_window_size, 1)


class TestModelV1:
    def test_model_v1(self) -> None:
        batch_size = 32
        sample = torch.randn(batch_size, 1, 22, 1024)
        model = ModelV1()
        output = model(sample)
        print(output.shape)
