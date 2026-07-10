# Motion Guidelines (Quy chuẩn Chuyển động)

Chuyển động (Motion) tại NoroFarm phục vụ mục đích duy nhất: Điều hướng sự chú ý và làm mượt quá trình chuyển đổi bối cảnh, tuyệt đối không dùng để trang trí rườm rà.

## 1. Thông số Timing & Easing
Sử dụng đường cong Easing tự nhiên (Giống vật lý thế giới thực).
- **Default Ease (Standard):** Tăng tốc nhanh, giảm tốc từ từ (Cubic-bezier `0.4, 0.0, 0.2, 1`). CSS: `ease-out`. Phù hợp cho Card xuất hiện, Modal mở ra.
- **Duration (Thời gian):**
  - Siêu nhanh (`100ms-150ms`): Đổi màu nền, viền (Hover).
  - Nhanh (`200ms`): Mở Dropdown, Tooltip, Toast.
  - Vừa (`300ms-500ms`): Mở Modal, Page transition, Phóng to ảnh (Image Zoom).

## 2. Spring Physics (Chuyển động Lò xo)
Sử dụng Framer Motion (React) cho các thành phần UI phức tạp để mô phỏng vật lý lò xo (Spring).
- Tạo cảm giác "chạm" (Tactile) giống ứng dụng Native iOS.
- Tham số chuẩn: `stiffness: 400, damping: 30` (Mượt mà, không bị rung lắc nảy quá đà - No overshoot).

## 3. Giảm thiểu Chuyển động (Reduced Motion)
Tôn trọng cài đặt hệ điều hành của người dùng.
- Nếu người dùng bật chế độ `prefers-reduced-motion` trong điện thoại/máy tính (người bị rối loạn tiền đình), MỌI animation bay nhảy, trượt ngang phải bị tắt.
- Thay thế bằng hiệu ứng Fade-in (Độ mờ 0 -> 1) cực kỳ đơn giản và an toàn.
