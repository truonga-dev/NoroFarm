import httpx
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger("norofarm")

class WeatherClient:
    """Service gọi API thời tiết (OpenWeather) và lấy tọa độ từ IP (IP-API)"""

    CITY_COORDS = {
        "đắk lắk": (12.6667, 108.0383, "Đắk Lắk"),
        "dak lak": (12.6667, 108.0383, "Đắk Lắk"),
        "buon ma thuot": (12.6667, 108.0383, "Đắk Lắk"),
        "gia lai": (13.9833, 108.0000, "Gia Lai"),
        "pleiku": (13.9833, 108.0000, "Gia Lai"),
        "kon tum": (14.3545, 108.0076, "Kon Tum"),
        "lâm đồng": (11.9404, 108.4583, "Lâm Đồng"),
        "lam dong": (11.9404, 108.4583, "Lâm Đồng"),
        "đắk nông": (12.0042, 107.6907, "Đắk Nông"),
        "dak nong": (12.0042, 107.6907, "Đắk Nông"),
        "hà nội": (21.0285, 105.8542, "Hà Nội"),
        "hanoi": (21.0285, 105.8542, "Hà Nội"),
        "hồ chí minh": (10.8231, 106.6297, "TP. Hồ Chí Minh"),
        "ho chi minh": (10.8231, 106.6297, "TP. Hồ Chí Minh"),
    }

    @staticmethod
    def _fallback_weather(name: str = "Tây Nguyên") -> Dict[str, Any]:
        return {
            "name": name,
            "main": {"temp": 27.5, "humidity": 72},
            "wind": {"speed": 2.8},
            "weather": [{"description": "trời quang mây tạnh", "icon": "02d"}],
        }
    
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"
        self._client: Optional[httpx.AsyncClient] = None

    def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=10.0, limits=httpx.Limits(max_keepalive_connections=10, max_connections=20))
        return self._client

    async def get_weather_by_city(self, city: str) -> Optional[Dict[str, Any]]:
        """Lấy thời tiết theo tên thành phố (Có Cache 15 phút)"""
        from app.core.redis import redis_client
        norm_city = city.strip().lower()
        cache_key = f"weather:city:{norm_city}"
        cached = await redis_client.get(cache_key)
        if cached:
            return cached

        if norm_city in self.CITY_COORDS:
            lat, lon, display_name = self.CITY_COORDS[norm_city]
            data = await self.get_weather_by_coords(lat, lon)
            if data:
                data = {**data, "name": display_name}
                await redis_client.set(cache_key, data, expire=900)
                return data
            return self._fallback_weather(display_name)

        if not self.api_key:
            logger.error("Chưa cấu hình OPENWEATHER_API_KEY")
            return self._fallback_weather(city)

        url = f"{self.base_url}?q={city}&appid={self.api_key}&units=metric&lang=vi"
        try:
            client = self._get_client()
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                await redis_client.set(cache_key, data, expire=900)
                return data
            logger.warning(f"OpenWeather API lỗi ({city}): {response.status_code} - dùng dữ liệu dự phòng")
        except Exception as e:
            logger.warning(f"Lỗi khi gọi OpenWeather API (city={city}): {e}")
        return self._fallback_weather(city)

    async def get_weather_by_coords(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """Lấy thời tiết theo tọa độ (Làm tròn 2 chữ số thập phân, Cache 15 phút)"""
        from app.core.redis import redis_client
        rounded_lat, rounded_lon = round(lat, 2), round(lon, 2)
        cache_key = f"weather:coords:{rounded_lat}:{rounded_lon}"
        cached = await redis_client.get(cache_key)
        if cached:
            return cached

        if not self.api_key:
            logger.error("Chưa cấu hình OPENWEATHER_API_KEY")
            return self._fallback_weather()

        url = f"{self.base_url}?lat={lat}&lon={lon}&appid={self.api_key}&units=metric&lang=vi"
        try:
            client = self._get_client()
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                await redis_client.set(cache_key, data, expire=900)
                return data
            logger.warning(f"OpenWeather API lỗi: {response.status_code} - dùng dữ liệu dự phòng")
        except Exception as e:
            logger.warning(f"Lỗi khi gọi OpenWeather API (coords={lat},{lon}): {e}")
        return self._fallback_weather()

    async def get_forecast_by_coords(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """Lấy dự báo thời tiết 5 ngày / 3 giờ theo tọa độ (Cache 30 phút)"""
        from app.core.redis import redis_client
        rounded_lat, rounded_lon = round(lat, 2), round(lon, 2)
        cache_key = f"weather:forecast:{rounded_lat}:{rounded_lon}"
        cached = await redis_client.get(cache_key)
        if cached:
            return cached

        if not self.api_key:
            logger.error("Chưa cấu hình OPENWEATHER_API_KEY")
            return None

        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={self.api_key}&units=metric&lang=vi"
        try:
            client = self._get_client()
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                await redis_client.set(cache_key, data, expire=1800)
                return data
            logger.error(f"OpenWeather Forecast API lỗi: {response.status_code} - {response.text}")
        except Exception as e:
            logger.error(f"Lỗi khi gọi OpenWeather Forecast API (coords={lat},{lon}): {e}")
        return None

    async def get_location_from_ip(self, ip: str) -> Optional[Dict[str, Any]]:
        """Lấy tọa độ/thành phố từ IP public (sử dụng ip-api.com)"""
        # Nếu là localhost/LAN, fallback về Hà Nội hoặc Hồ Chí Minh
        if not ip or ip in ["127.0.0.1", "::1", "localhost"] or ip.startswith("192.168.") or ip.startswith("10."):
            return {"city": "Hanoi", "lat": 21.0285, "lon": 105.8542}

        url = f"http://ip-api.com/json/{ip}"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=5.0)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "success":
                        return data
        except Exception as e:
            logger.error(f"Lỗi khi gọi IP-API (ip={ip}): {e}")
        
        # Fallback an toàn nếu lỗi mạng
        return {"city": "Ho Chi Minh", "lat": 10.8231, "lon": 106.6297}

weather_client = WeatherClient()
