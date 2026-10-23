from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import settings

db_url = settings.SQLALCHEMY_DATABASE_URI
is_sqlite = db_url.startswith("sqlite")

engine_kwargs: dict[str, Any] = {
    # Tắt echo để tránh serialize hàng ngàn dòng log SQL làm chậm I/O
    "echo": settings.ENVIRONMENT == "development" and False,
    "future": True,
    "pool_pre_ping": True,
}

if not is_sqlite:
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 1800, # Tự động làm mới kết nối sau 30 phút chống stale connection
        "pool_timeout": 30,
        "connect_args": {
            "statement_cache_size": 0,
            "prepared_statement_cache_size": 0
        },
    })

engine = create_async_engine(db_url, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
