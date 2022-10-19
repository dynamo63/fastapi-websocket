from sqlalchemy import Column, Integer, DateTime, String, Float
from .db import Base

class Transactions(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, index=True)
    weight = Column(Float)
    created_date = Column(DateTime, index=True)
