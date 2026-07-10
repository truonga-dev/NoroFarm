# Market Trend API (API Phân tích Thị trường)

## Tổng quan
Cung cấp mảng (Array) dữ liệu lịch sử giá cả kéo dài nhiều ngày/tháng để vẽ Biểu đồ (Chart). Khối lượng dữ liệu trả về khá lớn.

## Endpoints

### 1. Lấy Lịch sử Giá (Historical Data)
- **Endpoint:** `/api/v1/market/history?commodity={id}&region={id}&timeframe={tf}`
- **Method:** `GET`
- **Request Params:** 
  - `timeframe`: `7d` (7 ngày), `30d` (1 tháng), `1y` (1 năm), `all`.
- **Response (200 OK):**
```json
{
  "commodity": "coffee",
  "timeframe": "7d",
  "data_points": [
    { "date": "2026-07-04", "price": 105000 },
    { "date": "2026-07-05", "price": 106000 },
    // ...
  ]
}
```
- **Error (400):** Tham số `timeframe` không hợp lệ.

## Đặc tính Kỹ thuật
- **Authentication:** Public cho `7d` và `30d`. (Có thể yêu cầu Token đăng nhập đối với dữ liệu `1y` hoặc dữ liệu vĩ mô cao cấp).
- **Cache:** 
  - Lịch sử giá của ngày hôm qua trở về trước là Dữ Liệu Bất Biến (Immutable). 
  - Áp dụng Cache TTL siêu dài (24 giờ) hoặc vĩnh viễn trên Edge CDN. Chỉ lấy dữ liệu chênh lệch của ngày hôm nay trực tiếp từ DB.
- **Pagination:** Không dùng phân trang. Backend tự động giảm lấy mẫu (Downsampling) nếu người dùng yêu cầu khung thời gian quá dài. (VD: Xem 1 năm thì không trả về 365 ngày * 24 giờ, mà chỉ trả về 52 điểm của 52 tuần để vẽ chart mượt và nhẹ).
- **Rate Limit:** 30 requests / phút. Dữ liệu nặng nên giới hạn nghiêm ngặt hơn.
- **Security:** Kiểm tra chặt tham số (Sanitization) tránh SQL Injection qua các hàm Timeframe.
