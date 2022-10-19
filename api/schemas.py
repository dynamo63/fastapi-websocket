from datetime import datetime
from pydantic import BaseModel

class TransactionCreateItem(BaseModel):
    uid: str
    weight: int
    created_date: datetime

class TransactionItem(BaseModel):
    id: int
    uid: str
    weight: int
    created_date: datetime

    class Config:
        orm_mode = True
