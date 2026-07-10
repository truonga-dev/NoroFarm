# Triển khai Cơ sở dữ liệu (Supabase)

Supabase đóng vai trò nền tảng dữ liệu trung tâm (Data Platform) cung cấp Database, Authentication và Storage.

## 1. Quản lý Môi trường Supabase
Sẽ có 2 Project Supabase riêng biệt trên nền tảng Supabase Cloud:
- `NoroFarm Prod`: (Trỏ nhánh main, Database xịn).
- `NoroFarm Staging`: (Dành cho Dev/Testing).

## 2. Di trú Dữ liệu Tự động (Automated DB Migrations)
- Mọi thay đổi về Bảng, Trigger, RLS tuyệt đối không làm bằng tay qua Giao diện Web (Dashboard) trên môi trường Prod.
- Lập trình viên chạy lệnh qua `Supabase CLI` trên máy tính cục bộ để sinh ra file migration (Vd: `2026xxxx_add_table.sql`).
- Khi Merge PR vào `main`, Github Actions sẽ chạy `supabase db push` để đẩy sự thay đổi cấu trúc này lên Database Prod.

## 3. Cấu hình Kết nối (Connection Pooling)
- Supabase hỗ trợ Supavisor (Connection Pooler).
- Backend FastAPI KHÔNG kết nối thẳng vào cổng `5432` của Postgres (Sẽ gây cạn kiệt Connection nếu Traffic lớn).
- Bắt buộc dùng Pooler Connection String (Cổng `6543`, chế độ Transaction mode) trong biến môi trường `DATABASE_URL` của Backend.

## 4. Bảo mật API Keys
Supabase cung cấp 2 loại khóa (Keys):
- **`anon_key`:** (Khóa nặc danh) -> An toàn để đưa lên Frontend Next.js (Biến `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Chỉ lấy được dữ liệu nếu RLS cho phép.
- **`service_role_key`:** (Khóa siêu Admin) -> Chỉ Backend FastAPI giữ khóa này trong Biến môi trường. Không bao giờ lộ ra ngoài.
