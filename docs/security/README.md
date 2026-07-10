# Bảo mật Toàn diện (Security Guidelines)

## Mục tiêu
Thiết lập hệ thống tiêu chuẩn Bảo mật cho toàn bộ dự án NoroFarm dựa trên các hướng dẫn của OWASP Top 10 (Open Web Application Security Project). Tất cả lập trình viên và kiến trúc sư hệ thống phải tuân thủ nghiêm ngặt các tài liệu trong bộ guideline này để đảm bảo an toàn tối đa cho dữ liệu doanh nghiệp và người dùng.

## Phạm vi áp dụng
- Frontend (Next.js)
- Backend (FastAPI)
- Database (Supabase / PostgreSQL)
- Infrastructure (Vercel, Redis, Railway)

## Nguyên tắc cốt lõi (Core Principles)
1. **Phòng thủ theo chiều sâu (Defense in Depth):** Không phụ thuộc vào một lớp bảo vệ duy nhất. Backend phải tự validation dù Frontend đã làm. Database phải có RLS dù Backend đã kiểm tra quyền.
2. **Đặc quyền tối thiểu (Least Privilege):** Bất kỳ API, User, hoặc Service nào cũng chỉ được cấp quyền vừa đủ để hoàn thành nhiệm vụ. Không sử dụng quyền Super User cho các kết nối thông thường.
3. **Mặc định đóng (Secure by Default):** Mọi API đều yêu cầu xác thực trừ khi được đánh dấu công khai (Public) một cách có chủ đích.
4. **Không tin tưởng dữ liệu đầu vào (Zero Trust Data):** Mọi dữ liệu đến từ Client (Body, Query, Headers, File) đều là độc hại cho đến khi được kiểm chứng (Sanitized & Validated).
5. **Dấu vết và Ghi nhận (Accountability):** Hành động nào cũng phải để lại vết (Log/Audit) nhằm phục vụ công tác điều tra sự cố.

## Tổ chức Tài liệu
Thư mục `docs/security` chứa các chính sách và cơ chế chống lại các rủi ro cụ thể như: Xác thực, Phân quyền, Tấn công Injection, XSS, CSRF, Rò rỉ dữ liệu (Data Leakage) và Quản lý Secret. 

*Khuyến cáo: Hãy kiểm tra Security Checklist trước mỗi lần Release (Lên môi trường Production).*
