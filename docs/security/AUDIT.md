# Kiểm toán Bảo mật (Audit - OWASP A09:2021)

## Mục tiêu
Phát hiện sớm các hành vi vi phạm bảo mật và cung cấp dữ liệu bằng chứng không thể chối cãi khi sự cố đã xảy ra. (Phòng chống Security Logging and Monitoring Failures).

## Đối tượng cần Kiểm toán
1. **Truy cập nhạy cảm:**
   - Mọi nỗ lực Đăng nhập (Login) Thành công và Thất bại. Cảnh báo ngay nếu có 1 User thất bại 20 lần trong 1 phút.
   - Các hành vi Truy cập bị từ chối (403 Forbidden).
2. **Thao tác Dữ liệu:**
   - Cấp phát, thay đổi Quyền (Permissions/Roles).
   - Truy xuất hồ sơ số lượng lớn (Vd: API trả về hơn 1000 users trong 1 request - Nguy cơ rò rỉ dữ liệu (Data Exfiltration)).
   - Thay đổi các biến cấu hình hệ thống, xóa Log.

## Thuộc tính của Nhật ký Kiểm toán
Mỗi Audit Record phải ghi đủ 5 yếu tố `(5W)`:
- **Who:** Ai làm? (User ID, IP Address, Device Fingerprint).
- **When:** Khi nào? (UTC Timestamp).
- **What:** Làm gì? (Endpoint, Function, Request Body).
- **Where:** Tác động lên đâu? (Target ID, Database Table).
- **Why:** (Optional) Lý do (Ví dụ nhập lý do khi khóa tài khoản).

## Toàn vẹn Nhật ký (Log Integrity)
- Nhật ký Kiểm toán phải tuân thủ nguyên tắc Viết Một Lần (Append-Only).
- Trên PostgreSQL, phải vô hiệu hóa quyền `DELETE` hoặc `UPDATE` đối với bảng `audit_logs` đối với User API.
