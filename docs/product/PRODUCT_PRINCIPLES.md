# Nguyên tắc Sản phẩm (Product Principles)

## Các Nguyên lý Bất di bất dịch
Mọi tính năng mới khi được đề xuất BẮT BUỘC phải đối chiếu với 4 nguyên tắc này. Nếu vi phạm, tính năng đó sẽ bị loại bỏ.

### 1. Mobile First, Luôn luôn (Always Mobile-first)
- 90% nông dân Việt Nam ra rẫy với một chiếc điện thoại (Thường là Android tầm trung). 
- Do đó, thiết kế UI/UX trên màn hình Điện thoại là tiêu chuẩn gốc. Màn hình Desktop chỉ là bản mở rộng.
- Nút bấm (Button/Tab) phải to, rõ ràng, phù hợp với ngón tay của người làm nông (Thường to và có vết chai sạn).

### 2. Tốc độ là Tính năng (Speed is a Feature)
- Thời gian tải trang (TTFB, LCP) phải tính bằng mili-giây.
- Không hy sinh hiệu năng vì các hiệu ứng Animation màu mè không cần thiết.
- Nếu một tính năng làm chậm tốc độ tải trang quá 300ms, phải gỡ bỏ hoặc dùng WebWorker.

### 3. Không Quảng cáo Rác (Zero Trash Ads)
- Tuyệt đối cấm các loại quảng cáo Popup bật lên che giữa màn hình, quảng cáo rung lắc, hoặc quảng cáo chuyển hướng mồi nhử (Clickbait).
- Quảng cáo (nếu có) phải được thiết kế dạng Native (Hòa vào nội dung trang báo) để bảo vệ sự trong sạch của giao diện.

### 4. Thiết kế cho Người không rành Công nghệ (Design for the Non-tech-savvy)
- Từ ngữ (Copywriting) phải sử dụng ngôn ngữ bình dân, địa phương (Vd: "Cà phê nhân xô", "Tiêu đầu giá", "Rớt giá").
- Không dùng tiếng Anh bồi (Ví dụ: Thay vì dùng chữ `Login / Sign up`, phải dùng `Đăng nhập / Đăng ký`).
- Hạn chế số bước nhấp chuột tối đa. Nông dân chỉ cần mở App ra là thấy ngay cái họ cần (Bảng giá).
