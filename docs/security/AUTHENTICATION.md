# Quản lý Xác thực (Authentication - OWASP A07:2021)

## Mục tiêu
Ngăn chặn các cuộc tấn công liên quan đến Nhận dạng và Xác thực bị lỗi (Identification and Authentication Failures). Đảm bảo chỉ những thực thể hợp lệ (Người dùng, Hệ thống) mới được cấp quyền truy cập.

## Quy định về Mật khẩu (Password Policy)
- **Độ dài:** Tối thiểu 8 ký tự.
- **Độ phức tạp:** Bắt buộc có chữ Hoa, chữ Thường, Số và Ký tự đặc biệt.
- **Lưu trữ:** Mật khẩu không bao giờ được lưu dưới dạng văn bản thuần túy (Plaintext). Bắt buộc phải được băm (Hash) bằng thuật toán kháng tấn công GPU như `Bcrypt` hoặc `Argon2id` với cơ chế Random Salt.
- **Giới hạn số lần thử (Brute-force Protection):** Khóa tài khoản tạm thời (5-15 phút) sau 5 lần nhập sai mật khẩu liên tiếp.

## Quy định Đăng nhập
- **Chống dò đoán User (Enumeration):** Thông báo lỗi đăng nhập phải chung chung: "Tên đăng nhập hoặc mật khẩu không đúng", tuyệt đối không thông báo "Email này không tồn tại" hoặc "Sai mật khẩu" (Tránh Hacker biết tài khoản nào có thật).
- **MFA / 2FA (Xác thực 2 yếu tố):** Bắt buộc kích hoạt cho các tài khoản Quản trị (Super Admin). Sử dụng App Authenticator (TOTP) hoặc OTP qua SMS/Email.

## Quản lý Phiên (Session Management)
- **Timeout:** Phiên làm việc không hoạt động (Idle timeout) trên Admin CMS sẽ bị hủy sau 30 phút.
- **Hủy bỏ phiên (Invalidation):** Khi người dùng Đăng xuất (Logout) hoặc Đổi mật khẩu, mọi Phiên cũ trên tất cả các thiết bị phải lập tức bị vô hiệu hóa (Bằng cách xóa Cache Session/Refresh Token trong Redis).

## OAuth & Social Login
- Khi sử dụng đăng nhập qua Google/Facebook, phải xác minh trạng thái `email_verified: true` từ Nhà cung cấp.
- State parameter: Bắt buộc sử dụng tham số `state` để chống lại tấn công CSRF trong quá trình Callback đăng nhập OAuth.
