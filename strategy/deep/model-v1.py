import torch
from torch.utils.data import Dataset
import pandas as pd


class BoardDataset(Dataset):
    def __init__(
        self, df: pd.DataFrame,
    ):
        self.df = df

