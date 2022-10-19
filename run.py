import uvicorn
import asyncio
from api import app

async def main():
    config = uvicorn.Config("api.main:app", host="127.0.0.1", debug=True, port=8000, reload=True, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    asyncio.run(main())