from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from app.core.config import settings
from app.api import api_router

def create_app() -> FastAPI:
    logger.info("Initializing NoroFarm FastAPI Application...")
    
    app = FastAPI(
        title="NoroFarm API",
        version="1.0.0",
        openapi_url="/api/v1/openapi.json"
    )

    # Set all CORS enabled origins
    if settings.CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Include API router
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "ok", "environment": settings.ENVIRONMENT}

    return app

app = create_app()
