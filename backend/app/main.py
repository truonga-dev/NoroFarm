from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from contextlib import asynccontextmanager
# from prometheus_fastapi_instrumentator import Instrumentator

from app.core.config import settings
from app.core.logger import logger
from app.core.telemetry import setup_telemetry
from app.core.redis import redis_client, rate_limit
from app.core.scheduler import scheduler
from app.api.v1.api import api_router
from app.common.exceptions import (
    CustomException,
    global_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
)
from fastapi.exceptions import RequestValidationError, HTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.tasks.crawlers import run_all_crawlers, run_weather_sync

# --- Modern FastAPI Lifespan Handler ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi động ứng dụng (Startup)
    logger.info("Khởi động ứng dụng NoroFarm Backend")
    # Connect Redis
    await redis_client.connect()
    # Kiểm tra nguồn giá có thể xác thực mỗi 5 phút; giao diện tự làm mới nhanh hơn.
    await scheduler.add_task("fetch_all_commodity_prices", run_all_crawlers, 300)
    # Thêm tác vụ đồng bộ thời tiết từ OpenWeather mỗi 12 tiếng (43200s)
    await scheduler.add_task("sync_weather_data", run_weather_sync, 43200)
    # Khởi động Scheduler
    await scheduler.start()

    yield

    # Đóng ứng dụng (Shutdown)
    logger.info("Đóng ứng dụng")
    await scheduler.stop()
    await redis_client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend for NoroFarm",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- Telemetry & Metrics ---
setup_telemetry(app)

# --- Middlewares (Thứ tự thêm: CORSMiddleware phải được thêm CUỐI CÙNG để bọc bên ngoài cùng) ---
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)
cors_origins = [origin.rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS] if settings.BACKEND_CORS_ORIGINS else []
for dev_origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
    if dev_origin not in cors_origins:
        cors_origins.append(dev_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Exception Handlers ---
app.add_exception_handler(CustomException, global_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# --- Prometheus Metrics (phải gọi ở đây, trước khi app start) ---
# instrumentator = Instrumentator().instrument(app)

# --- Routers ---
app.include_router(api_router, prefix=settings.API_V1_STR)

# --- Custom Rate Limit Middleware ---
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    try:
        await rate_limit(request, limit=200, window=60) # Global limit
    except Exception as e:
        if isinstance(e, Exception) and hasattr(e, "status_code"): # is HTTPException
            return JSONResponse(status_code=429, content={"success": False, "message": "Quá nhiều yêu cầu. Vui lòng thử lại sau.", "data": None, "errors": None})
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        logger.exception(f"Unhandled error in request: {exc}")
        error_res = await unhandled_exception_handler(request, exc)
        origin = request.headers.get("origin")
        if origin and (origin in cors_origins or "*" in cors_origins):
            error_res.headers["Access-Control-Allow-Origin"] = origin
            error_res.headers["Access-Control-Allow-Credentials"] = "true"
        return error_res
