# Tấn công Tiêm nhiễm (SQL Injection - OWASP A03:2021)

## Mục tiêu
Đảm bảo Hacker không thể chèn câu lệnh SQL bất hợp pháp vào Input (Text box, Query params) nhằm thay đổi cấu trúc truy vấn, từ đó trích xuất hoặc phá hủy dữ liệu Database.

## Chiến lược phòng thủ

1. **KHÔNG BAO GIỜ cộng chuỗi (String Concatenation):**
   - TUYỆT ĐỐI CẤM kiểu viết: 
     `query = "SELECT * FROM users WHERE email = '" + input_email + "'"`
   - Kẻ xấu truyền `admin' OR '1'='1` sẽ đọc được toàn bộ DB.

2. **Sử dụng Parameterized Queries / ORM (Bắt buộc):**
   - NoroFarm sử dụng ORM **SQLAlchemy** trong FastAPI. ORM luôn tự động mã hóa biến (Binding) theo chuẩn Prepared Statement của DB Driver. Do đó, việc dùng ORM chuẩn đã chặn đứng 99% lỗi SQL Injection.
   - Nếu phải chạy Query SQL thuần (Raw SQL), BẮT BUỘC dùng tham số Bind (Ví dụ: `SELECT * FROM users WHERE email = :email`).

3. **Ngăn chặn ở tầng Supabase (PostgreSQL):**
   - Áp dụng Row Level Security (RLS). Ngay cả khi bị lỗi SQL Injection tại Endpoint, truy vấn sẽ được thực thi dưới danh nghĩa (Role) của người dùng hiện tại (Thông qua JWT nhúng vào SET SESSION). 
   - Nếu User A bị Injection đòi đọc dữ liệu User B, RLS của Postgres sẽ từ chối truy vấn này, đóng vai trò như lớp bảo vệ thứ 2.
