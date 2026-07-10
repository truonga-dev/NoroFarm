# Quản lý Mã Bí mật (Secret Management)

## Mục tiêu
Mã bí mật bao gồm Mật khẩu Database, JWT Secret, OpenWeather API Key, Supabase Service Role Key. Đây là "Chìa khóa vạn năng", nếu bị lộ, toàn bộ hệ thống sập.

## Lưu trữ Bí mật (Secret Storage)
1. **Tuyệt đối Không Hardcode:** Không một chuỗi Secret nào được nằm trong file `.ts` hay `.py`.
2. **Quản lý trên Cloud:**
   - Trên Vercel (Frontend): Sử dụng tính năng Vercel Environment Variables.
   - Trên Railway/Render (Backend): Nhập trực tiếp vào Bảng điều khiển Environment.
   - Cấm lưu cấu hình Production trong file `.env` nén lại gửi qua Zalo hay Email nội bộ. Nên dùng công cụ chia sẻ Secret an toàn như `Bitwarden` hoặc `Doppler`.

## Trách nhiệm của Frontend (Next.js)
- Tại Frontend, các biến môi trường bắt đầu bằng tiền tố `NEXT_PUBLIC_` sẽ bị Next.js đóng gói công khai thẳng vào mã JavaScript mà trình duyệt tải về.
- QUY TẮC: **Tuyệt đối KHÔNG** đặt tiền tố `NEXT_PUBLIC_` cho bất kỳ API Key bí mật nào. Chỉ dùng nó cho Supabase Public Anon Key.
- Các Secret thật sự (VD: Stripe Secret Key, Supabase Service Key) phải để tên bình thường không có tiền tố, và chỉ được phép gọi (Execute) bên trong Next.js API Routes hoặc Server Actions (Nơi mã chạy trên Server).
