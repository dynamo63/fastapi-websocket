from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from .models import Base, Transactions
from .schemas import TransactionItem, TransactionCreateItem
from .crud import get_transactions, create_transaction
from .db import get_db, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Static files
app.mount("/static/", StaticFiles(directory="frontend/build/static"), name="static")

templates = Jinja2Templates(directory="frontend/build")

# CORS Validation

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LET'S CREATE A MANAGER FOR THE SOCKETS
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, new_data: str):
        for connection in self.active_connections:
            await connection.send_json(new_data)

manager = ConnectionManager()

# ENDPOINT
@app.get("/")
def root(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@app.post("/transactions/add/", response_model=TransactionItem)
async def create(item_to_create: TransactionCreateItem, db: Session = Depends(get_db)):
    db_item = create_transaction(db, item_to_create)
    await manager.broadcast(item_to_create.json()) # Send the new data to all connection
    return db_item

@app.get("/transactions", response_model=list[TransactionItem])
async def list_transactions(limit: int = 100, db: Session = Depends(get_db)):
    items = get_transactions(db, limit)
    return items

# CREATE WEBSOCKET
@app.websocket("/ws")
async def real_time_list(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)