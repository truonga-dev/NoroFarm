from typing import Optional, Any
import redis.asyncio as redis
import json
from app.core.config import settings
from fastapi import Request, HTTPException

import time
import logging

logger = logging.getLogger("norofarm")

class RedisCache:
    """
    Hệ thống Caching hiệu năng cao 2 tầng:
    - Tầng 1 (L1): In-memory cache cục bộ (phản hồi siêu nhanh < 0.1ms)
    - Tầng 2 (L2): Redis distributed cache (chia sẻ giữa các workers/containers)
    Tự động fallback về In-memory nếu Redis chưa bật, đảm bảo hệ thống không bao giờ bị gián đoạn.
    """
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
        self._local_cache: dict[str, dict] = {}

    async def connect(self):
        try:
            self.redis = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=2.0,
                socket_timeout=2.0
            )
            await self.redis.ping()
            logger.info("Kết nối Redis Cache thành công.")
        except Exception as e:
            logger.warning(f"Không thể kết nối Redis ({settings.REDIS_URL}): {e}. Chuyển sang In-memory Cache.")
            self.redis = None

    async def close(self):
        if self.redis:
            try:
                await self.redis.close()
            except Exception:
                pass

    async def set(self, key: str, value: Any, expire: int = 3600):
        # Lưu vào L1 Local Cache
        now = time.time()
        self._local_cache[key] = {
            "value": value,
            "expire_at": now + expire
        }
        # Lưu vào Redis L2 Cache nếu có kết nối
        if self.redis:
            try:
                json_data = json.dumps(value, default=str)
                await self.redis.set(key, json_data, ex=expire)
            except Exception as e:
                logger.debug(f"Redis set error ({key}): {e}")

    async def get(self, key: str) -> Optional[Any]:
        now = time.time()
        # Kiểm tra L1 Local Cache trước
        if key in self._local_cache:
            item = self._local_cache[key]
            if now < item["expire_at"]:
                return item["value"]
            else:
                del self._local_cache[key]

        # Kiểm tra Redis L2 Cache
        if self.redis:
            try:
                val = await self.redis.get(key)
                if val:
                    data = json.loads(val)
                    # Cập nhật ngược lại vào L1
                    self._local_cache[key] = {"value": data, "expire_at": now + 60}
                    return data
            except Exception as e:
                logger.debug(f"Redis get error ({key}): {e}")

        return None

    async def delete(self, key: str):
        self._local_cache.pop(key, None)
        if self.redis:
            try:
                await self.redis.delete(key)
            except Exception as e:
                logger.debug(f"Redis delete error ({key}): {e}")

    async def delete_pattern(self, pattern: str):
        # Xóa L1 keys
        import fnmatch
        keys_to_del = [k for k in self._local_cache.keys() if fnmatch.fnmatch(k, pattern)]
        for k in keys_to_del:
            self._local_cache.pop(k, None)

        # Xóa Redis keys
        if self.redis:
            try:
                keys = await self.redis.keys(pattern)
                if keys:
                    await self.redis.delete(*keys)
            except Exception as e:
                logger.debug(f"Redis delete_pattern error ({pattern}): {e}")

redis_client = RedisCache()

def get_client_ip(request: Request) -> str:
    """Trích xuất IP thực tế của client kể cả khi nằm sau Reverse Proxy/Cloudflare/ALB"""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    if request.client:
        return request.client.host
    return "unknown"

async def rate_limit(request: Request, limit: int = 100, window: int = 60):
    """
    Rate Limiter an toàn sử dụng Redis dựa trên IP thật của client
    """
    if not redis_client.redis:
        return
        
    client_ip = get_client_ip(request)
    key = f"rate_limit:{client_ip}"
    
    current = await redis_client.redis.get(key)
    if current and int(current) >= limit:
        raise HTTPException(status_code=429, detail="Quá nhiều yêu cầu. Vui lòng thử lại sau giây lát.")
        
    pipe = redis_client.redis.pipeline()
    pipe.incr(key, 1)
    pipe.expire(key, window)
    await pipe.execute()
