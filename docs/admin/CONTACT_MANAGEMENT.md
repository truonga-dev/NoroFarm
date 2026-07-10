# Quản lý Liên hệ (Contact & Feedback Management)

## Mục tiêu
Trung tâm tiếp nhận thư từ, ý kiến phản hồi, báo lỗi từ người dùng (Gửi từ trang Liên hệ ngoài Front-office).

## Chức năng
- **Hộp thư đến (Inbox):** Liệt kê các Ticket.
- **Trạng thái:** Đánh dấu Mới (New), Đang xử lý (In Progress), Đã đóng (Resolved).
- **Phản hồi (Reply):** Soạn Email trả lời trực tiếp cho khách hàng từ trong Giao diện Admin.

## Layout
- Tương tự giao diện Gmail hoặc Zendesk. 
- Trái: Danh sách thư. Phải: Nội dung thư chi tiết và Khung soạn thảo trả lời.

## Quyền truy cập
- `contact:manage` (Customer Support - CS).

## Luồng xử lý
1. Khách điền Form ngoài trang chủ. DB lưu vào `contacts`.
2. Admin CS vào đọc. Bấm "Trả lời", gõ nội dung.
3. API gửi lệnh về Backend. Backend gọi thư viện SMTP (Hoặc SendGrid/Mailgun) bắn Email về hòm thư thật của Khách.
4. Chuyển trạng thái Ticket sang `Resolved`.

## Security
- Chống Spam: API ngoài Front-office phải tích hợp reCAPTCHA. Nếu không Admin sẽ phải đọc hàng vạn thư Rác do Bot tự động điền form.
