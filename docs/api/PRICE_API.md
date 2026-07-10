# Price API (API Giá Nông Sản)

## Tổng quan
Cung cấp dữ liệu giá cả chớp nhoáng (Real-time/Near real-time) của các mặt hàng nông sản chủ lực.

## Endpoints

### 1. Lấy giá mới nhất (Latest Price)
- **Endpoint:** `/api/v1/prices/latest?commodity={type}&region={id}`
- **Method:** `GET`
- **Request Params:** `commodity=coffee,pepper`, `region=daklak,gialai` (Mặc định lấy tất cả vùng nếu để trống).
- **Response (200 OK):**
```json
{
  "data": [
    {
      "commodity": "coffee",
      "region_id": "daklak",
      "region_name": "Đắk Lắk",
      "price": 110000,
      "unit": "VND/kg",
      "change_amount": 500,
      "change_percent": 0.45,
      "updated_at": "2026-07-10T06:00:00Z"
    }
  ]
}
```
- **Error (404):** Không tìm thấy hàng hóa.

### 2. Stream Giá Real-time (WebSocket)
- **Endpoint:** `ws://api.norofarm.com/v1/prices/stream`
- **Method:** `WS` (WebSocket Connection)
- **Mô tả:** Server chủ động push dữ liệu xuống mỗi khi có biến động giá mới nhất, Frontend không cần Polling.

## Đặc tính Kỹ thuật
- **Authentication:** Public (Không yêu cầu Token).
- **Cache:** 
  - Lưu Cache Redis tại Backend với TTL 5 phút. 
  - Browser Cache/CDN Edge Cache: `Cache-Control: public, max-age=300`.
- **Pagination:** Không áp dụng (Dữ liệu giá hiện tại là một tập rất nhỏ khoảng 10-20 vùng).
- **Rate Limit:** Vừa phải. 60 requests / 1 phút / IP.
- **Security:** Dữ liệu Read-only. Rate limiting chặn DDOS.
