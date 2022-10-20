import uvicorn
import asyncio
from api import app

async def main():
    config = uvicorn.Config("api.main:app", host="0.0.0.0", debug=True, port=8080, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    asyncio.run(main())