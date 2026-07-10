# Biến Môi trường (Environment Variables)

Quản lý biến môi trường chặt chẽ là yếu tố sống còn của Security. TUYỆT ĐỐI không commit file `.env` vào kho lưu trữ (Git).

## 1. Quy định Đặt tên (Naming Convention)
- Biến cho Backend: Chữ hoa, cách nhau bởi gạch dưới. Vd: `DATABASE_URL`.
- Biến cho Frontend: Phải có tiền tố `NEXT_PUBLIC_` nếu muốn mã nguồn Javascript trên trình duyệt đọc được. (Vd: `NEXT_PUBLIC_API_URL`). Biến không có tiền tố này sẽ được giấu kín trên Server Next.js.

## 2. Quản lý trên các Nền tảng (Platform Secrets)

### Vercel (Frontend)
- Nhập tay các biến qua Giao diện Setting của Vercel (Hoặc dùng Vercel CLI).
- Ví dụ:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_API_URL` (Trỏ về URL của Railway Backend).

### Railway / Render (Backend)
- Nhập qua giao diện Variables.
- Ví dụ:
  - `DATABASE_URL` (Chuỗi kết nối Supabase Pooler).
  - `REDIS_URL`
  - `JWT_SECRET_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENWEATHER_API_KEY`

### GitHub Actions (Secrets)
- Những biến cần cho quá trình CI/CD.
- Ví dụ: `SUPABASE_ACCESS_TOKEN` để Github có quyền thay đổi Database.

## 3. Xác thực Biến môi trường (Validation)
- Tại Backend FastAPI, sử dụng **Pydantic `BaseSettings`**. 
- Hệ thống sẽ chặn ứng dụng khởi động (Crash immediately) và báo lỗi đỏ nếu thiếu bất kỳ Biến Môi Trường bắt buộc nào, tránh việc lỗi phát sinh ngầm lúc Runtime.
