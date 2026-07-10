# Weather API (API Thời Tiết)

## Tổng quan
Cung cấp dữ liệu khí tượng chuẩn xác cho khu vực trồng trọt. Backend hoạt động như một Proxy/Adapter để lấy dữ liệu từ OpenWeatherMap/AccuWeather và chuẩn hóa lại.

## Endpoints

### 1. Thời tiết hiện tại & Dự báo ngắn hạn
- **Endpoint:** `/api/v1/weather/forecast?lat={x}&lon={y}`
- **Method:** `GET`
- **Request Params:** `lat`, `lon` (Tọa độ GPS) hoặc `region_id`.
- **Response (200 OK):**
```json
{
  "current": {
    "temp": 28,
    "condition": "rain",
    "description": "Mưa rào nhẹ",
    "humidity": 85,
    "precipitation_mm": 12.5
  },
  "forecast_3_days": [ ... ]
}
```
- **Error (400):** Tọa độ không hợp lệ. (502): Provider thời tiết bên thứ 3 đang bị sập.

## Đặc tính Kỹ thuật
- **Authentication:** Public (Không yêu cầu Token) cho tính năng cơ bản.
- **Cache:** CỰC KỲ QUAN TRỌNG.
  - Thời tiết không thay đổi từng giây. Redis Cache TTL: 30 phút hoặc 1 giờ.
  - Điều này giúp tiết kiệm hàng ngàn USD tiền mua API thời tiết từ Provider gốc.
- **Pagination:** Không áp dụng.
- **Rate Limit:** 30 requests / 1 phút / IP. (Để chặn đối thủ cào dữ liệu thời tiết gián tiếp qua server NoroFarm).
- **Security:** Giấu hoàn toàn API Key của Provider (OpenWeatherMap) ở tầng Backend. Không bao giờ lộ xuống Frontend.
