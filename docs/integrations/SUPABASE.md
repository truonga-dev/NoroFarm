# Tích hợp Supabase (Backend as a Service)

## Mục tiêu
Sử dụng Supabase như là Trái tim của Hệ thống Lưu trữ và Xác thực. Supabase cung cấp PostgreSQL mạnh mẽ cùng với các dịch vụ vệ tinh (Auth, Storage, Realtime) giúp giảm 50% thời gian code Backend.

## 1. Tích hợp Supabase Auth (Xác thực)
- Đóng vai trò là Identity Provider (Nhà cung cấp Danh tính).
- Mọi tác vụ Đăng ký, Đăng nhập (Email/Password, Google OAuth), Quên mật khẩu đều gọi thẳng qua SDK của Supabase (`@supabase/ssr` trên Next.js).
- JWT do Supabase cấp phát sẽ được kẹp vào Header để gọi xuống các API của FastAPI. FastAPI sẽ dùng khóa `JWT_SECRET` của Supabase để giải mã (Verify) mà không cần chọc vào DB.

## 2. Tích hợp Database (PostgreSQL)
- **FastAPI kết nối:** Sử dụng `SQLAlchemy` (ORM) kết nối qua chuỗi Transaction Pooling (`postgresql://pooler...`) để tận dụng tính năng PgBouncer của Supabase, chống sập DB khi có quá nhiều API calls.
- **Next.js kết nối:** Hạn chế gọi DB trực tiếp từ Next.js. Next.js chủ yếu lấy dữ liệu qua FastAPI. Tuy nhiên, với một số trang tĩnh SSG, Next.js có thể dùng thư viện `supabase-js` lấy data trực tiếp bằng `Anon Key` (Chỉ đọc) để tăng tốc độ Build.

## 3. Tích hợp Supabase Realtime (WebSockets)
- Sử dụng để làm Bảng giá Nhấp nháy (Flashing Prices) giống bảng chứng khoán.
- **Luồng:** FastAPI cập nhật Giá vào DB -> DB bắn tín hiệu ra kênh Realtime (Broadcast) -> Next.js Frontend Subscribe (Đăng ký) kênh này bằng `supabase-js` -> Giao diện tự động nhảy giá mới mà không cần Reload trang.

## 4. Tích hợp Storage (Lưu trữ file)
- Tham khảo tài liệu `docs/admin/MEDIA_LIBRARY.md`. Client Upload trực tiếp lên Bucket.

## Bảo mật (Row Level Security - RLS)
Dù tích hợp ở bất cứ phương thức nào, BẮT BUỘC phải bật RLS trên bảng của Supabase.
- Bảng `prices`: Khách vãng lai chỉ có quyền `SELECT`. 
- Bảng `profiles`: User chỉ có quyền `SELECT` và `UPDATE` lên chính ID của mình.
- Backend FastAPI sẽ dùng `Service Role Key` (Chìa khóa chúa - Vượt qua mọi RLS) nên Key này phải được giấu cực kỳ cẩn thận.
