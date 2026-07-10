# Bảo mật JWT (JSON Web Tokens)

## Mục tiêu
Thiết lập chuẩn an toàn cho việc cấp phát, lưu trữ và xác thực Token để giao tiếp giữa Frontend và Backend.

## Cấu trúc và Thuật toán
- **Thuật toán:** Chỉ sử dụng HMAC SHA-256 (`HS256`) hoặc RSA (`RS256`).
- Tuyệt đối từ chối các Token có header `alg: "none"` (Lỗ hổng Bypass xác thực kinh điển).
- **Mã bí mật (Secret Key):** Phải dài tối thiểu 64 ký tự ngẫu nhiên, lưu trữ trong Biến môi trường (Environment Variables) hoặc Secret Manager. KHÔNG BAO GIỜ hardcode trong source code.

## Payload (Dữ liệu mang theo)
- **Hạn chế dữ liệu:** JWT không được mã hóa mà chỉ mã hóa base64, ai cũng đọc được. Tuyệt đối KHÔNG lưu Mật khẩu, Số điện thoại hay Thông tin nhạy cảm vào Payload. Chỉ lưu `user_id` và `role`.
- **Claims bắt buộc:** Phải có `exp` (Thời gian hết hạn), `iat` (Thời gian phát hành), và `iss` (Nguồn phát hành, vd: `api.norofarm.com`).

## Vòng đời Token (Lifecycle)
Hệ thống phải dùng kiến trúc 2 Token (Dual-token architecture):
1. **Access Token (JWT):** Thời gian sống ngắn (Short-lived), chỉ từ **15 đến 30 phút**.
2. **Refresh Token (Opaque String):** Thời gian sống dài (7-30 ngày). 
   - Refresh Token là một chuỗi ngẫu nhiên (UUID), KHÔNG PHẢI JWT. 
   - Refresh Token phải được lưu trong **Redis** và gắn với thiết bị. Điều này giúp Backend có khả năng thu hồi (Revoke) phiên làm việc bất cứ lúc nào bằng cách xóa nó khỏi Redis.

## Lưu trữ phía Client
- **Web App (Next.js):** 
  - Access Token phải được lưu trong biến RAM cục bộ (Zustand/Context). Không lưu ở LocalStorage (Dễ bị XSS đọc trộm).
  - Hoặc lưu vào **HTTP-Only, Secure, SameSite=Lax Cookies**. JavaScript Frontend sẽ không thể chạm vào Cookie này.
- **Mobile App:** Lưu an toàn bằng Secure Storage / Keychain của iOS/Android.

## Xử lý Đăng xuất (Logout)
- Frontend xóa Cookie.
- Gọi API Backend. Backend xóa Refresh Token tương ứng ra khỏi Redis.
- Vì Access Token (JWT) không thể thu hồi (Stateless), nếu cần độ bảo mật cực đoan, áp dụng cơ chế **JWT Blacklist** trên Redis để lưu lại các JWT bị huỷ trước hạn `exp`.
