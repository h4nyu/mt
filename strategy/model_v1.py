import torch
from torch.utils.data import Dataset, DataLoader
from torch import Tensor, nn, optim
import timm
import pandas as pd
import pytorch_lightning as pl
import typer
app = typer.Typer()

MAX_QUANTITY = 1000_000
MAX_ASK_BID_QUANTITY = 50_000


def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df["time"] = pd.to_datetime(df["time"])
    df["time_diff"] = df["time"].diff().dt.total_seconds()
    df = df.dropna()
    df = df.sort_values("time")
    for col in df.columns:
        if "Quantity" in col:
            df[col] = df[col] / MAX_QUANTITY
        elif "ask" in col or "bid" in col:
            df[col] = df[col] / MAX_ASK_BID_QUANTITY
    return df


class BoardDataset(Dataset):
    def __init__(
        self,
        df: pd.DataFrame,
        before_window_size: int = 1024,
        after_window_size: int = 128,
    ):
        self.before_columns = [
            *reversed([f"asks[{i}].quantity" for i in range(10)]),
            "price_diff",
            "time_diff",
            *[f"bids[{i}].quantity" for i in range(10)],
        ]
        self.before_window_size = before_window_size
        self.after_window_size = after_window_size
        self.after_columns = ["price_diff"]
        self.df = df
        print(self.before_columns)

    def __len__(self) -> int:
        return len(self.df) - self.before_window_size - self.after_window_size

    def __getitem__(self, idx: int) -> dict[str, torch.Tensor]:
        before = self.df.iloc[idx : idx + self.before_window_size].copy()
        current_price = self.df.iloc[idx + self.before_window_size]["price"]

        after = self.df.iloc[
            idx
            + self.before_window_size : idx
            + self.before_window_size
            + self.after_window_size
        ].copy()
        before["price_diff"] = before["price"] - current_price
        after["price_diff"] = after["price"] - current_price
        before_values = before[self.before_columns].values.transpose()
        after_values = after[self.after_columns].values.transpose()
        return dict(
            before=torch.tensor(before_values).expand(1, -1, -1).float(),
            after=torch.tensor(after_values).expand(1, -1, -1).float(),
        )


class ModelV1(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.encoder = timm.create_model("tf_efficientnet_b0_ns", pretrained=False)
        self.conv_stem = nn.Conv2d(1, 3, kernel_size=1, stride=1, bias=False, padding=0)
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(
                1280,
                512,
                kernel_size=(1, 3),
                stride=(1, 2),
                padding=(0, 1),
                output_padding=(0, 1),
            ),
            nn.BatchNorm2d(512),
            nn.ConvTranspose2d(
                512,
                1,
                kernel_size=(1, 3),
                stride=(1, 2),
                padding=(0, 1),
                output_padding=(0, 1),
            ),
        )

    def forward(self, x: Tensor) -> Tensor:
        x = self.conv_stem(x)
        features = self.encoder.forward_features(x)
        x = self.decoder(features)
        return x


class LtModelV1(pl.LightningModule):
    def __init__(self, lr: float = 1e-3) -> None:
        super().__init__()
        self.model = ModelV1()
        self.save_hyperparameters()

    def configure_optimizers(self): # type: ignore
        optimizer = optim.Adam(self.parameters(), lr=1e-3)
        return optimizer

    def training_step(self, batch: dict[str, Tensor], batch_idx: int) -> Tensor: # type: ignore
        before = batch["before"]
        after = batch["after"]
        pred = self.model(before)
        loss = nn.MSELoss()(pred, after)
        self.log("train_loss", loss, prog_bar=True, on_step=False, on_epoch=True)
        return loss

    def validation_step(
        self, batch: dict[str, Tensor], batch_idx: int, dataloader_idx: int = 0
    ) -> None:
        before = batch["before"]
        after = batch["after"]
        pred = self.model(before)
        loss = nn.MSELoss()(pred, after)
        self.log("val_loss", loss, prog_bar=True, on_step=False, on_epoch=True)
        return loss



@app.command()
def train() -> None:
    pl.seed_everything()
    trainer = pl.Trainer(
        devices=[0],
        deterministic=True,
        max_epochs=10000,
    )
    train_df = pd.read_table("../datasets/2023-08-11-export/8035.T/split/train_0.tsv")
    train_df = preprocess(train_df)
    train_loader = DataLoader(BoardDataset(train_df), batch_size=32, num_workers=8, shuffle=True)
    test_df = pd.read_table("../datasets/2023-08-11-export/8035.T/split/test_0.tsv")
    test_df = preprocess(test_df)
    test_loader = DataLoader(BoardDataset(test_df), batch_size=32, num_workers=8)
    model = LtModelV1()
    trainer.fit(model, train_loader, test_loader)





if __name__ == "__main__":
    app()
