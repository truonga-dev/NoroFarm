# Kiểm thử Bảo mật (Security Testing)

## Mục tiêu
Liên tục quét và phát hiện các lỗ hổng bảo mật trong mã nguồn tự viết và các thư viện mã nguồn mở (Dependencies) được nhúng vào dự án.

## Quét Tĩnh (SAST - Static Application Security Testing)
- **Công cụ:** `SonarQube` hoặc `Semgrep`.
- **Cách hoạt động:** Quét trực tiếp Source Code (Không cần chạy Server) để tìm ra các lỗi viết code ngớ ngẩn như Hardcode API Key, sử dụng hàm băm yếu (MD5), không đóng kết nối DB, hoặc nối chuỗi SQL.
- **Thời điểm:** Tự động chạy mỗi khi có lệnh `git push`.

## Quét Động (DAST - Dynamic Application Security Testing)
- **Công cụ:** `OWASP ZAP`.
- **Cách hoạt động:** Tự động bắn các Payload chứa XSS, SQL Injection vào một Server đang chạy thử nghiệm (Staging) giống như một Hacker thật sự để xem Server có bị sập hay trả về dữ liệu mật hay không.
- **Thời điểm:** Chạy mỗi đêm vào lúc 2h sáng (Nightly Run).

## Quản lý Thư viện (Dependency Scanning)
- **Công cụ:** `Dependabot` (Tích hợp sẵn trên GitHub).
- Dự án sử dụng rất nhiều thư viện ngoài (NPM, PyPI). Nếu một thư viện bị phát hiện có lỗ hổng (Ví dụ vụ Log4j khét tiếng), Dependabot sẽ tự động gửi Cảnh báo Đỏ và tự động tạo Pull Request nâng cấp phiên bản thư viện đó lên bản vá an toàn.
- Yêu cầu mọi Dev KHÔNG BỎ QUA các thông báo của Dependabot.

## Kiểm tra Thâm nhập Thủ công (Manual Pen-Test)
Mỗi 6 tháng, cần có Chuyên gia Bảo mật độc lập (Thường là thuê ngoài) để thực hiện rà soát Hệ thống nhằm tìm ra các lỗ hổng Logic phức tạp mà các tool tự động không thể phát hiện được.
