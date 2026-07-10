# Quản lý Rate Limit (Giới hạn tỷ lệ)

## Mục tiêu
Bảo vệ hệ thống khỏi các cuộc tấn công Từ chối dịch vụ (DDoS), Tấn công dò mật khẩu (Brute-force) và Cào dữ liệu (Web Scraping / Crawling). Giữ cho Server không bị sập do quá tải.

## Kiến trúc 
Rate Limiting phải được xử lý càng gần người dùng càng tốt, tối ưu nhất là tại rìa mạng (Edge) hoặc Load Balancer, thay vì để lọt vào tới Database.
- **Lớp 1 (Edge Network):** Cloudflare WAF hoặc Vercel Edge Firewall. Chặn các Request mang tính chất phá hoại hoặc cào dữ liệu từ IP nước ngoài.
- **Lớp 2 (API Gateway / FastAPI Middleware):** Dùng Redis (Ví dụ thư viện `slowapi` hoặc thuật toán `Token Bucket` / `Sliding Window`) để đếm lượt gọi chi tiết cho từng IP hoặc từng User.

## Cấu hình Giới hạn cơ bản
Được định nghĩa theo từng nhóm API:
1. **Public API (Đọc dữ liệu giá, tin tức):**
   - Giới hạn: 100 requests / 1 phút / 1 IP.
   - Quá giới hạn: Trả về HTTP 429 (Too Many Requests).
2. **Auth API (Đăng nhập, Quên mật khẩu, Gửi OTP):**
   - Giới hạn cực gắt để chống Spam SMS/Email và Brute-force.
   - Giới hạn: 5 requests / 5 phút / 1 IP (hoặc 1 Email).
3. **Admin API (Ghi dữ liệu, Upload file):**
   - Giới hạn dựa trên JWT Token thay vì IP (Vì nhiều Admin có thể ngồi cùng văn phòng chung 1 IP).
   - Giới hạn: 200 requests / 1 phút / 1 Admin.

## Trả về Headers
Mọi API chịu sự quản lý của Rate Limit phải gửi kèm các Headers chuẩn cho Client biết tình trạng:
- `X-RateLimit-Limit`: Số lượt tối đa được phép.
- `X-RateLimit-Remaining`: Số lượt còn lại.
- `X-RateLimit-Reset`: Thời gian (Unix timestamp) khi giới hạn được khôi phục.

## Xử lý vi phạm
- Nếu một IP liên tục chạm ngưỡng Rate Limit nhiều lần (Vd: Nhận 5 lần lỗi 429 trong 1 giờ), IP đó sẽ bị đưa vào Danh sách đen (Blacklist) tạm thời trong Redis, chặn toàn bộ truy cập 24 giờ.
