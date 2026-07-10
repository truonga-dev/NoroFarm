# Ghi nhật ký (Security Logging)

## Mục tiêu
Chuẩn hóa cách Server tạo ra Log (Application Logs) nhằm che giấu thông tin nhạy cảm, đồng thời tương thích tốt với các hệ thống Phân tích Log trung tâm (SIEM) sau này.

## Che giấu Dữ liệu (Data Masking & Sanitization)
- Backend (FastAPI Logger) BẮT BUỘC phải cọ rửa (Sanitize) Request trước khi ghi ra màn hình console hay file `.log`.
- **Tuyệt đối KHÔNG LOG các trường sau:**
  - `password`, `password_confirm`
  - `access_token`, `refresh_token`, `jwt`
  - `api_key`, `secret`
  - Thông tin thẻ tín dụng / thanh toán (Nếu có).
- **Cách xử lý:** Thay thế giá trị bằng chuỗi `***REDACTED***`.

## Định dạng Log (Log Format)
- Bắt buộc ghi Log ở định dạng **JSON** để các công cụ như Elasticsearch, Datadog dễ dàng lập chỉ mục (Index) và tìm kiếm. Đừng dùng định dạng Text truyền thống.
- **Mẫu Log chuẩn:**
```json
{
  "timestamp": "2026-07-10T07:22:35Z",
  "level": "ERROR",
  "request_id": "req-1234abcd",
  "user_id": "usr-9876",
  "client_ip": "14.232.xxx.xxx",
  "action": "login_failed",
  "message": "Invalid password attempt"
}
```

## Theo dõi phân tán (Distributed Tracing)
- Gắn thêm một Header `X-Request-ID` duy nhất sinh ra từ Frontend ở mỗi Request.
- Chuyển tiếp ID này đi xuyên suốt qua Next.js -> FastAPI -> Redis -> Database.
- Khi có một lỗi sập ngầm, DevOps chỉ cần tìm chuỗi ID này là ra nguyên một đường dây (Trace) để xem yêu cầu bị nghẽn ở hệ thống nào.
