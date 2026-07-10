# Cross-Site Request Forgery (CSRF)

## Mục tiêu
CSRF là hình thức lừa trình duyệt của nạn nhân (Đang có sẵn phiên đăng nhập hợp lệ của NoroFarm) gửi một Yêu cầu (Request) giả mạo thay đổi mật khẩu hoặc xóa dữ liệu mà nạn nhân không hề hay biết.

## Khi nào hệ thống bị CSRF?
Nếu hệ thống sử dụng **Session Cookies** để xác thực, trình duyệt sẽ tự động đính kèm Cookie này vào mọi Request bay đến miền `norofarm.com`, bất kể Request đó được kích hoạt từ trang web lừa đảo `phishing-site.com`.

*(Nếu NoroFarm dùng JWT lưu trong RAM của React gửi qua Header `Authorization: Bearer <token>`, ứng dụng miễn nhiễm hoàn toàn với CSRF).*

## Các Biện pháp phòng chống (Nếu dùng Cookie)

1. **SameSite Cookie Attribute:**
   - Bắt buộc thiết lập Cookie JWT với thuộc tính `SameSite=Lax` hoặc `SameSite=Strict`.
   - `Lax`: Cookie không gửi theo các yêu cầu POST/PUT/DELETE xuất phát từ domain khác.
   - `Strict`: Cookie không bao giờ gửi đi nếu URL không phải là nội bộ (An toàn nhất, nhưng UX sẽ kém nếu user bấm từ email sang web).

2. **CSRF Tokens (Double Submit Cookie):**
   - Nếu áp dụng Cookie cho Admin CMS, cấu hình FastAPI sinh ra 1 CSRF Token.
   - Trả token này về Frontend trong 1 Header hoặc Cookie riêng biệt.
   - Ở mỗi Request tiếp theo (POST/PUT), Frontend phải tự tay đọc Token này và bỏ vào Custom Header `X-CSRF-Token`. Trang web lừa đảo không thể đọc được Token này vì bị CORS chặn, nên Request giả mạo sẽ thất bại.
