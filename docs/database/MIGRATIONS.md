# Database Migrations (Lịch sử Di trú DB) & Functions

Tại NoroFarm, mọi thay đổi trong Database KHÔNG ĐƯỢC thực hiện thủ công trên Dashboard của Supabase, mà phải được quản lý bằng mã nguồn thông qua `Supabase CLI` (Migration files).

## 1. Quy trình Migrations
- Các file migration được lưu tại thư mục `supabase/migrations/` trên máy tính cục bộ.
- Tên file có dạng: `YYYYMMDDHHMMSS_mo_ta_ngan_gon.sql`.
- Quy trình: Sửa đổi trên Local Database -> Chạy thử -> Push lên Git -> CI/CD tự động apply migration lên Supabase Production.

## 2. Các Triggers & Functions thiết yếu

### Trigger 1: Tự động tạo Profile
- **Tình huống:** Khi một người dùng mới đăng ký (Supabase Auth tạo ra bản ghi mới trong `auth.users`).
- **Giải pháp:** Một hàm Database Function (viết bằng plpgsql) được gắn với Trigger `AFTER INSERT ON auth.users`. Hàm này sẽ tự động chạy câu lệnh `INSERT INTO public.profiles (id, full_name, phone) VALUES (new.id, new.raw_user_meta_data->>'name', new.phone)`.
- Điều này loại bỏ hoàn toàn rủi ro Frontend quên tạo profile sau khi đăng ký.

### Trigger 2: Cập nhật `updated_at`
- **Mục đích:** Tự động sửa cột `updated_at` của bảng `profiles` hoặc `news` thành thời gian hiện tại (`now()`) mỗi khi có câu lệnh `UPDATE` xảy ra trên dòng đó. Không cần lập trình viên Backend phải truyền thủ công biến thời gian vào.

## 3. Database Functions (RPC - Remote Procedure Calls)
Đôi khi, việc kéo hàng chục nghìn dòng dữ liệu về Backend FastAPI để tính toán là quá nặng. Ta đưa logic tính toán xuống thẳng Database.

- **RPC `get_price_trend_summary`:** 
  - Một hàm SQL tính toán Tốc độ tăng trưởng trung bình (Moving Average) của giá cà phê trong 30 ngày. Frontend hoặc Backend gọi thẳng hàm này qua Supabase RPC API, Postgres sẽ tính cực kỳ nhanh và chỉ trả về 1 dòng kết quả duy nhất.
