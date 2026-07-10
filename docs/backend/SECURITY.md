# Bảo mật (Security)

## 1. Bảo mật API Endpoint (Authentication)
- Sử dụng **JWT (JSON Web Token)** để xác thực.
- Khởi tạo Dependency `get_current_user` bằng FastAPI `OAuth2PasswordBearer`.
- Bất kỳ Router nào cần khóa, chỉ việc thêm `user: User = Depends(get_current_user)`.
- Secret Key mã hóa JWT lấy từ biến môi trường (`.env`). Mặc định dùng thuật toán `HS256`.

## 2. Bảo mật Supabase (Role & RLS)
- Frontend client giao tiếp với Backend FastAPI.
- Backend FastAPI giao tiếp với Supabase thông qua **Service Role Key** (Chìa khóa tối cao, bypass Row Level Security của Database).
- CHÚ Ý: Cực kỳ cấm lộ Service Role Key ra Frontend hoặc đưa vào mã nguồn Public. Phải bảo quản trong biến môi trường Backend.
- Với các tính năng Frontend (Next.js) trực tiếp gọi Supabase (Nếu có), chỉ được cấp **Anon Key**. Dữ liệu sẽ bị khóa cứng bởi RLS PostgreSQL.

## 3. Rate Limiting (Chống DDOS / Spam)
- Dùng Middleware Redis để đếm số Request.
- Cấu hình:
  - Auth Routes (`/login`, `/register`): 5 requests / 15 phút / IP.
  - Public Data (`/prices`, `/weather`): 60 requests / 1 phút / IP.
- Xử lý vượt ngưỡng: Trả về HTTP Status `429 Too Many Requests`.

## 4. Validation (Pydantic)
- FastAPI tích hợp sẵn Pydantic, bảo vệ hệ thống khỏi các Dữ liệu rác (Payload Injection).
- Nếu User truyền lên chuỗi khi Server cần số nguyên, hoặc thiếu trường bắt buộc, Pydantic tự động chặn lại ngay tại Cửa Router và trả về HTTP `422 Unprocessable Entity`. Tầng Service không bao giờ phải kiểm tra thủ công.

## 5. CORS (Cross-Origin Resource Sharing)
- Cấu hình Middleware FastAPI `CORSMiddleware`.
- Chỉ chấp nhận Request đến từ danh sách nguồn (Origins) an toàn: `https://norofarm.com`, `http://localhost:3000` (Dev). Khóa các Origin lạ cố tình gọi trộm API.
