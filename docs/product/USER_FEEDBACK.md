# Quản lý Phản hồi Người dùng (User Feedback Strategy)

## Mục tiêu
Dữ liệu phân tích (Analytics) chỉ cho ta biết người dùng làm GÌ (What), nhưng Phản hồi (Feedback) mới cho ta biết TẠI SAO (Why) họ làm vậy. Tài liệu này định nghĩa cách thu thập tiếng nói của nông dân.

## Cơ chế Thu thập
1. **Nút "Góp ý" In-app:**
   - Một nút nhỏ, cố định ở góc dưới màn hình.
   - Khi bấm vào, hiện Form đơn giản (Textarea + Nút Gửi).
   - Dữ liệu bắn thẳng về kênh Slack `#user-feedback` để cả team Product đọc ngay lập tức.
2. **Khảo sát Nhanh (Micro-surveys):**
   - Không bắt người dùng điền form Google Form dài 10 câu.
   - Thỉnh thoảng (dùng PostHog định kỳ), trượt một thông báo nhỏ gọn 1 câu hỏi duy nhất (Vd: "Bảng giá hôm nay có dễ đọc không?" -> 3 nút Emoji: Khóc / Bình thường / Cười).
3. **Phỏng vấn Chuyên sâu (User Interviews):**
   - Hàng tháng, Product Manager (PM) phải nhấc máy gọi điện cho 5 người dùng (Lấy SĐT từ Database những người đăng ký) để hỏi về trải nghiệm thực tế đi vườn của họ.

## Xử lý và Phân loại (Triaging)
- **Bugs (Lỗi kỹ thuật):** Chuyển ngay cho Dev fix trong 24h.
- **UX Issues (Lỗi trải nghiệm):** Bấm nhầm nút, chữ quá nhỏ. Gom lại vào Sprint sau.
- **Feature Requests (Yêu cầu tính năng):** Ghi nhận vào Backlog. Nếu có trên 20 người cùng yêu cầu một tính năng (Vd: Xem giá Tiêu), PM sẽ cân nhắc đưa lên Roadmap Quý tới.
