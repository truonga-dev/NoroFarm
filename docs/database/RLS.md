# Row Level Security (RLS) - Bảo mật Cấp độ Dòng

Supabase sử dụng RLS của PostgreSQL để quyết định xem User nào (dựa trên JWT Authentication) được quyền Đọc/Ghi dòng dữ liệu nào.

## 1. Cấu hình Cơ bản
- Bật (Enable) RLS cho MỌI BẢNG (Tất cả 100%).
- `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`

## 2. Chính sách (Policies) cho dữ liệu Công khai (Public)
Các bảng `commodities`, `regions`, `prices`, `news` là dữ liệu đọc công khai, nhưng chỉ Admin mới được viết/sửa.

**Bảng `prices`:**
- **Policy SELECT (Read):** Dành cho tất cả mọi người (Bao gồm cả khách chưa đăng nhập - `anon` role).
  - Điều kiện: `TRUE`
- **Policy INSERT/UPDATE/DELETE:** Bị chặn hoàn toàn từ phía Client (Supabase JS Client). Chỉ Backend (FastAPI sử dụng Service Role Key) mới có quyền bypass RLS để ghi dữ liệu Giá và Tin tức vào DB.

## 3. Chính sách cho dữ liệu Cá nhân (Private)
**Bảng `profiles`:**
- **Policy SELECT:** Mọi người được xem profile của nhau (Nếu có tính năng cộng đồng) HOẶC chỉ User mới thấy profile của mình (`auth.uid() = id`).
- **Policy UPDATE:** Một User chỉ được phép cập nhật ảnh Avatar, Tên của chính mình.
  - Điều kiện: `auth.uid() = id`.

**Bảng `user_favorites`:**
- **Policy SELECT:** Chỉ được xem danh sách ghim của mình.
  - Điều kiện: `user_id = auth.uid()`
- **Policy INSERT/DELETE:** Chỉ được phép Thêm/Xóa mục ghim của chính mình.
  - Điều kiện: `user_id = auth.uid()`

## 4. Bảo vệ Backend
Backend FastAPI của NoroFarm sẽ tương tác với Supabase thông qua **Supabase Service Role Key** (Quyền siêu Admin). Key này bỏ qua mọi quy tắc RLS. Do đó, logic xác thực bổ sung phải được viết cẩn thận ở tầng Middleware của FastAPI để tránh lộ lọt dữ liệu khi gọi API.
