# Quản lý Nhật ký Hệ thống (Logging)

## 1. Thư viện sử dụng
- Python mặc định có thư viện `logging`, nhưng NoroFarm sẽ dùng **`Loguru`** hoặc cấu hình **Structlog** (JSON Format) để đạt hiệu năng và độ rõ ràng cao nhất.

## 2. Tiêu chuẩn Ghi log
Hệ thống log phải ghi ra JSON để mai sau dễ dàng đẩy lên Datadog, ELK Stack hoặc CloudWatch. Không ghi dạng Text thô vì khó Filter tìm kiếm lỗi.

### Các cấp độ (Levels)
- `DEBUG`: Chi tiết Query Database, Dữ liệu nháp (Chỉ bật trên môi trường Dev).
- `INFO`: User A đăng nhập thành công, Khởi tạo Server thành công, Gọi API Thời tiết tốn 300ms.
- `WARNING`: User nhập sai Password 3 lần, API Thời tiết phản hồi chậm (2s).
- `ERROR`: Lỗi Database sập, API 3rd-party lỗi 500 (Gửi Alert lên Slack).
- `CRITICAL`: Toàn bộ Redis sập, Không thể kết nối Database.

## 3. Traceability (Theo dõi Request)
- Đính kèm **Request ID (UUID)** vào mỗi HTTP Request thông qua Middleware.
- Mỗi khi log một sự kiện trong Service hay DB, luôn in kèm `Request_ID` này ra. 
- Lợi ích: Khi có lỗi `ERROR` xảy ra, Admin copy `Request_ID` tìm kiếm trong File Log sẽ ra chính xác quá trình Request đó đi từ Router -> Service -> DB như thế nào, gỡ lỗi (Debug) nhàn hạ hơn rất nhiều.

## 4. Bảo mật Log (Data Masking)
- TUYỆT ĐỐI KHÔNG log thông tin nhạy cảm: Mật khẩu người dùng (Ngay cả khi lỗi), JWT Tokens, API Keys của hệ thống.
- Cấu hình bộ lọc (Filter) tự động biến các trường `password`, `token` thành `***` trước khi xuất file.
