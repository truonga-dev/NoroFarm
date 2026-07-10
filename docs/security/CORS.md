# Cross-Origin Resource Sharing (CORS)

## Mục tiêu
Bảo vệ Backend FastAPI không bị truy cập trái phép bằng JavaScript từ một tên miền (Domain) khác nằm ngoài hệ sinh thái của NoroFarm.

## Cấu hình CORS
1. **White-list (Danh sách trắng):**
   - Backend KHÔNG BAO GIỜ được phép đặt `allow_origins=["*"]` trên môi trường Production.
   - Chỉ mở cửa cho các Domain của hệ sinh thái:
     - `https://norofarm.com`
     - `https://admin.norofarm.com`
     - Các nhánh (Branch) trên Vercel Preview (Cần dùng Regex nếu Domain thay đổi linh hoạt).

2. **Cấu hình Allow Credentials:**
   - Nếu Frontend lưu JWT vào Cookie `HttpOnly` và cần gửi Cookie này lên Server, CORS phải cấu hình `allow_credentials=True`.
   - Lưu ý: Trình duyệt sẽ CHẶN đứng `allow_credentials=True` nếu `allow_origins=["*"]`. (Đó là lý do bắt buộc phải chỉ định rõ tên miền).

3. **Giới hạn Methods và Headers:**
   - `allow_methods`: Chỉ cho phép `GET, POST, PUT, PATCH, DELETE, OPTIONS`.
   - `allow_headers`: Chỉ cho phép các header cần thiết như `Authorization`, `Content-Type`.
