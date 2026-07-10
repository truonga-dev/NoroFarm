# Xây dựng Kịch bản Test (Test Cases)

## Mục tiêu
Quy chuẩn hóa cách viết các kịch bản kiểm thử (Test Cases) để bất kỳ ai (Developer, QA mới, hoặc AI) nhìn vào cũng có thể thực hiện theo từng bước và biết kết quả cuối cùng phải là gì.

## Cấu trúc một Test Case chuẩn

**Test ID:** `TC-AUTH-001`
**Tên Test Case:** Đăng nhập sai mật khẩu quá 5 lần.
**Phân hệ:** Xác thực (Authentication).
**Độ ưu tiên (Priority):** Cao (High).
**Tiền điều kiện (Pre-conditions):** 
- Người dùng đã có tài khoản hợp lệ `test@norofarm.com`.
- Tài khoản đang ở trạng thái Hoạt động.

**Các bước thực hiện (Steps to Reproduce):**
1. Truy cập vào trang `https://norofarm.com/login`.
2. Nhập Email: `test@norofarm.com`.
3. Nhập Mật khẩu sai: `123456`.
4. Bấm nút "Đăng nhập". Lặp lại bước 2-4 năm lần liên tiếp.

**Kết quả mong muốn (Expected Result):**
- Lần 1-4: Hệ thống báo lỗi đỏ "Tên đăng nhập hoặc mật khẩu không đúng".
- Lần thứ 5: Hệ thống báo lỗi đỏ "Tài khoản của bạn đã bị khóa tạm thời 15 phút do nhập sai quá nhiều lần". Nút Đăng nhập bị vô hiệu hóa (Disabled).

**Kết quả thực tế (Actual Result):** (QA điền vào lúc test) - PASS / FAIL.

## Quản lý Test Cases
Toàn bộ Test Cases phải được quản lý tập trung trên một công cụ chuyên dụng (JIRA Zephyr, TestRail) hoặc tối thiểu là một Bảng tính Excel chia sẻ (Google Sheets) để Tracking tiến độ Test của đợt Release.
