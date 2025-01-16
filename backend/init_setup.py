import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from app.db.database import Base
from app.models.user import User
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    # Get database URL from environment
    DATABASE_URL = os.getenv("DATABASE_URL")
    if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

    # Create async engine
    engine = create_async_engine(DATABASE_URL, echo=True)

    async with engine.begin() as conn:
        # Drop all existing tables
        await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

    await engine.dispose()

if __name__ == "__main__":
    print("Initializing database...")
    asyncio.run(init_db())
    print("Database initialization completed!") 