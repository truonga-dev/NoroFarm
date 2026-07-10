# Tích hợp Email & Giao tiếp (Email Delivery)

## Mục tiêu
Cung cấp kênh liên lạc chính thức (Transactional Emails) để gửi Mã OTP quên mật khẩu, Xác thực tài khoản mới, và Thông báo sự cố kỹ thuật cho Admin.

## Nhà cung cấp đề xuất (Provider)
- **Resend** (Lựa chọn số 1 hiện nay cho Next.js/React, dễ code form bằng React Email).
- Lựa chọn thay thế: **SendGrid**, **Amazon SES**, **Postmark**.

## Chiến lược Tích hợp
1. **Cấu hình Domain (DNS):**
   - Bắt buộc phải xác thực Tên miền (Domain Authentication) bằng cách thêm các bản ghi DKIM, SPF, DMARC vào Cloudflare/Vercel.
   - Nếu không làm bước này, 100% email gửi đi từ NoroFarm sẽ rơi vào hộp thư Rác (Spam) của Gmail.
2. **Template Email:**
   - Email gửi cho người dùng (Vd: Khôi phục mật khẩu) phải được thiết kế đẹp, có logo NoroFarm, nút bấm (Call to Action) rõ ràng, và Responsive tốt trên màn hình Điện thoại (Vì đa số người dùng mở mail bằng điện thoại).
   - Nên dùng thư viện `react-email` để code giao diện email trực tiếp bằng React thay vì vật lộn với các bảng HTML Table cổ điển.

## Các Luồng Gửi Mail Chính (Triggers)
- **Magic Link / OTP:** Khi người dùng quên mật khẩu, Backend sinh 1 mã Token, nhúng vào Link, gọi API Resend gửi mail. Hạn dùng link là 15 phút.
- **Báo cáo Tuần (Weekly Newsletter):** Nếu có tính năng Marketing. Dùng Background Worker gom tin tức thị trường nổi bật nhất trong tuần và bắn mail hàng loạt cho Subscriber (Cần tuân thủ quy định Anti-spam, phải có nút Unsubscribe).
- **Báo lỗi Hệ thống (Alerting):** Khi Database sập, Backend tự động gửi một đoạn Plain-text Email khẩn cấp đến hòm thư của Đội ngũ DevOps (`dev@norofarm.com`).

## Xử lý Lỗi (Bounces)
- Thiết lập Webhook từ Resend/SendGrid bắn ngược lại Backend FastAPI.
- Nếu email gửi đi bị báo Lỗi (Bounce) hoặc người dùng Đánh dấu là Spam (Complaint), Backend sẽ cập nhật trạng thái User đó thành "Cấm gửi mail" để giữ Uy tín (Reputation) cho IP hệ thống.
