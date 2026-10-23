from fastapi import APIRouter
from app.api.v1.endpoints import (
    users,
    auth,
    weather,
    commodities,
    commodity_categories,
    notifications,
    admin,
    news,
    media,
    health,
    market,
    test_email,
    shop,
    contacts
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(commodities.router, prefix="/commodities", tags=["commodities"])
api_router.include_router(commodity_categories.router, prefix="/commodity-categories", tags=["commodity_categories"])
api_router.include_router(weather.router, prefix="/weather", tags=["weather"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(test_email.router, prefix="/test-email", tags=["test"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(market.router, prefix="/market", tags=["market"])
api_router.include_router(shop.router, prefix="/shop", tags=["shop"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
