from sqlalchemy.orm import Session
from sqlalchemy import desc
from .models import Transactions
from .schemas import TransactionItem, TransactionCreateItem


def get_transactions(db: Session, limit: int = 100):
    return db.query(Transactions).order_by(desc(Transactions.created_date)).limit(limit).all()

def create_transaction(db: Session, item: TransactionCreateItem):
    transaction = Transactions(uid=item.uid, weight=item.weight, created_date=item.created_date)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction
