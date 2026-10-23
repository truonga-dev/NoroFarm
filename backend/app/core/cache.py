from typing import Any, Optional
from datetime import datetime, timedelta

class SimpleCache:
    """
    Bộ đệm (Cache) đơn giản lưu trong bộ nhớ (In-memory cache)
    Dành cho mục đích caching API thời tiết
    """
    def __init__(self):
        self._cache = {}

    def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        """Lưu giá trị vào cache với thời gian sống (TTL)"""
        expire_at = datetime.now() + timedelta(seconds=ttl_seconds)
        self._cache[key] = {"value": value, "expire_at": expire_at}

    def get(self, key: str) -> Optional[Any]:
        """Lấy giá trị từ cache, trả về None nếu đã hết hạn hoặc không tồn tại"""
        if key in self._cache:
            item = self._cache[key]
            if datetime.now() < item["expire_at"]:
                return item["value"]
            else:
                del self._cache[key]
        return None

    def delete(self, key: str):
        """Xóa một key khỏi cache"""
        if key in self._cache:
            del self._cache[key]

# Đối tượng cache singleton
cache = SimpleCache()
