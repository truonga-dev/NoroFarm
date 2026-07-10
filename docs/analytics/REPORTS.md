# Hệ thống Báo cáo Tự động (Automated Reports)

## Mục tiêu
Thay vì bắt Ban Giám đốc và Đội Marketing ngày nào cũng phải vào xem Dashboard, Hệ thống sẽ tự động xuất dữ liệu và gửi Báo cáo định kỳ để duy trì sự chú ý.

## 1. Báo cáo Tóm tắt Hàng ngày (Daily Digest)
- **Thời gian gửi:** 08:00 AM mỗi sáng.
- **Kênh nhận:** Kênh Slack nội bộ (`#analytics`) hoặc Nhóm Telegram Công ty.
- **Nội dung (Bot tự động nhắn):**
  - Số lượt truy cập ngày hôm qua (DAU).
  - So sánh với ngày hôm trước (Tăng/Giảm %).
  - Bài báo được đọc nhiều nhất hôm qua.
  - Từ khóa người dùng tìm kiếm nhưng KHÔNG CÓ kết quả (Zero-result searches) để BTV viết bài bù đắp.

## 2. Báo cáo Đánh giá Tuần / Tháng (Weekly/Monthly Review)
- **Thời gian gửi:** Sáng Thứ Hai hàng tuần, hoặc Ngày Mùng 1 hàng tháng.
- **Kênh nhận:** Email (Gửi tự động qua SendGrid/Resend).
- **Nội dung:**
  - Xu hướng Tăng trưởng người dùng mới (New Users).
  - Tỷ lệ Giữ chân (Retention Rate). Bao nhiêu người truy cập tuần trước có quay lại vào tuần này.
  - Phân tích sâu về nguồn Traffic (Ví dụ: Tuần này chiến dịch Share Facebook đem về bao nhiêu người).
  - Tốc độ tải trang trung bình (Core Web Vitals). Đảm bảo Dev không làm web chậm đi.

## Phương tiện Thực thi (Execution)
- Có thể dùng tính năng Export Scheduled Report của GA4.
- Nếu cần tùy biến cao: Dùng Python viết 1 script nhỏ, chạy bằng Cronjob, query dữ liệu từ PostHog API và gửi tin nhắn qua Telegram Bot API.
