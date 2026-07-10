# Authentication API (API Xác thực)

## Tổng quan
Quản lý đăng ký, đăng nhập và cấp phiên làm việc (Session) qua JWT. Dành cho người dùng (Nông dân/Thương lái) cần lưu sở thích (Ghim giá, Vùng thời tiết).

## Endpoints

### 1. Đăng ký (Register)
- **Endpoint:** `/api/v1/auth/register`
- **Method:** `POST`
- **Request Body:** `{ "phone": "0901234567", "password": "...", "name": "Nguyễn Văn A" }`
- **Response (201 Created):** `{ "message": "Đăng ký thành công", "user_id": "uuid" }`
- **Error (400):** SĐT đã tồn tại, mật khẩu yếu.

### 2. Đăng nhập (Login)
- **Endpoint:** `/api/v1/auth/login`
- **Method:** `POST`
- **Request Body:** `{ "phone": "0901234567", "password": "..." }`
- **Response (200 OK):** `{ "access_token": "jwt...", "refresh_token": "jwt...", "expires_in": 3600 }`
- **Error (401):** Sai mật khẩu hoặc SĐT.

### 3. Làm mới Token (Refresh Token)
- **Endpoint:** `/api/v1/auth/refresh`
- **Method:** `POST`
- **Request Body:** `{ "refresh_token": "jwt..." }`
- **Response (200 OK):** Trả về bộ token mới.

## Đặc tính Kỹ thuật
- **Authentication:** Không yêu cầu để gọi các endpoint trên.
- **Cache:** Bỏ qua (No-cache) cho mọi API liên quan đến Auth.
- **Pagination:** Không áp dụng.
- **Rate Limit:** Siêu nghiêm ngặt. 5 requests / 15 phút / IP cho endpoint login/register (Tránh Brute-force).
- **Security:**
  - Mật khẩu phải mã hóa bcrypt/argon2 ở Backend.
  - Token lưu trữ tại Client: `access_token` lưu trong memory/HttpOnly Cookie, `refresh_token` lưu trong HttpOnly, Secure, SameSite=Strict Cookie. Cấm lưu JWT ở LocalStorage để chống XSS.
