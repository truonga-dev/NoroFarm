# Thiết kế: Trang Liên hệ (Contact Us)

## 1. Mục tiêu
Tạo kênh giao tiếp trực tiếp với người dùng. Giao diện biểu mẫu (Form) phải cực kỳ đơn giản, không làm người dùng cảm thấy "lười" điền. Cung cấp thông tin địa chỉ minh bạch.

## 2. Bố cục (Layout)
- **Cấu trúc 2 cột (Desktop):**
  - **Cột Trái (Thông tin):** Địa chỉ văn phòng, Số điện thoại (Hotline), Email, và bản đồ Google Maps nhỏ (bo góc `rounded-2xl`).
  - **Cột Phải (Form):** Biểu mẫu liên hệ.
- **Mobile:** Chuyển thành 1 cột. Thông tin liên hệ nằm trên, Form nằm dưới.

## 3. Biểu mẫu Liên hệ (Contact Form)
- Các trường nhập liệu lớn (`h-12`). Border mỏng.
- **Bố cục Form:**
  - Hàng 1: Họ tên (50%) - Số điện thoại (50%).
  - Hàng 2: Email (100%).
  - Hàng 3: Chủ đề (Select Dropdown - Góp ý, Báo lỗi, Hợp tác).
  - Hàng 4: Nội dung tin nhắn (Textarea, tối thiểu 4 dòng).
  - Hàng 5: Nút Gửi (Primary Button rộng 100%, có trạng thái Loading spin).

## 4. FAQ (Câu hỏi Thường gặp)
Nằm dưới khu vực liên hệ.
- Bố cục dạng **Accordion** (Danh sách xổ xuống).
- Căn giữa trang (`max-w-3xl`). 
- Khi click vào câu hỏi, câu trả lời mở ra mượt mà với animation mở rộng chiều cao (Height transition).

## 5. Màu sắc
- Form có nền trắng (hoặc đen mờ trong Dark Mode). Background của toàn bộ trang Liên hệ có thể dùng màu `Surface` (xám nhạt) để làm khối Form nổi bật lên (thông qua shadow).
