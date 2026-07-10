# Quản lý Phân quyền (Authorization - OWASP A01:2021)

## Mục tiêu
Phòng chống Lỗi kiểm soát truy cập (Broken Access Control) - Lỗ hổng số 1 trong OWASP Top 10. Đảm bảo Người dùng đã xác thực chỉ được phép thực hiện những hành động mà họ được cấp phép.

## Nguyên tắc Phân quyền
- **Chối bỏ mặc định (Deny by Default):** Bất kỳ truy cập nào không có luật (Rule) định nghĩa rõ ràng đều bị từ chối với mã lỗi `403 Forbidden`.
- **RBAC (Role-Based Access Control):** Phân quyền dựa trên Nhóm người dùng (Ví dụ: Admin, Editor, User).
- **ABAC/PBAC (Attribute/Policy-Based):** Kiểm tra quyền sở hữu (Ownership). Ví dụ: User A chỉ được sửa hồ sơ của User A. User A không thể sửa hồ sơ của User B dù cả 2 cùng mang Role là "User".

## Tầng Bảo vệ (Layered Protection)
Việc kiểm tra quyền hạn phải diễn ra ở 2 tầng độc lập:
1. **Tầng Application (FastAPI):** Middleware/Decorator kiểm tra JWT Role trước khi đi vào Logic xử lý.
2. **Tầng Database (Supabase RLS):** Row Level Security trên PostgreSQL đảm bảo rằng ngay cả khi API bị lỗi Logic (Tầng App lọt), DB vẫn từ chối thực thi query nếu JWT Role không khớp với Policy.

## Chống Tấn công IDOR (Insecure Direct Object Reference)
- Không sử dụng ID tự tăng (Auto-increment ID như `1, 2, 3`) trên URL cho các tài nguyên nhạy cảm (Đơn hàng, Hóa đơn). Việc dùng số đếm giúp Hacker dễ dàng thay ID=1 thành ID=2 để xem trộm.
- **Giải pháp:** Sử dụng **UUID v4** hoặc **CUID** làm Khóa chính (Primary Key) lộ ra bên ngoài.
- Luôn phải thêm điều kiện `WHERE user_id = {current_user_id}` vào mọi truy vấn Update/Delete để xác nhận quyền sở hữu dữ liệu.

## Directory Traversal (Lỗ hổng duyệt thư mục)
- Không bao giờ cho phép người dùng truyền trực tiếp tên file tĩnh (Ví dụ: `/api/download?file=../../etc/passwd`). Mọi tên file phải được ánh xạ qua Database ID hoặc bị tước (Strip) các ký tự đường dẫn `../`.
