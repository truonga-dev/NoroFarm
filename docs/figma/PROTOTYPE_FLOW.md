# Prototype Flow & Animations (Luồng Tương tác)

## 1. Luồng Người dùng (User Flows trong Figma)

### Flow 1: Đăng nhập (Authentication)
- Khởi đầu: Frame `Landing Page`.
- Action: Bấm nút "Đăng nhập" ở Header.
- Kết nối (Noodle): Trỏ tới Frame `Login Modal` (Mở dạng Overlay, Centered, Add background behind).
- Action: Nhập số điện thoại -> Bấm Submit.
- Kết nối: Trỏ tới Frame `Dashboard_Desktop`.

### Flow 2: Xem Chi tiết Biểu đồ Thị trường
- Khởi đầu: Frame `Dashboard_Desktop`.
- Action: Bấm vào Card "Thị trường Cà phê" (On Click).
- Kết nối: Chuyển trang (Navigate to) Frame `Market_Detail_Desktop`.

## 2. Hoạt ảnh (Motion & Animation)
NoroFarm nhấn mạnh vào trải nghiệm mượt mà. Trong Figma Prototype, sử dụng cấu hình **Smart Animate** thay vì Instant hay Dissolve.

- **Easing Function:** Chọn `Custom Spring` hoặc `Ease Out`.
  - Spring (Lò xo mềm): Stiffness ~300, Damping ~30. Tạo cảm giác tương tác tự nhiên, không cứng ngắc.
  - Duration: `300ms` cho chuyển trang, `150ms` cho Hover/Mở Dropdown.

## 3. Interactive Components (Thành phần Tương tác)
Thay vì vẽ chằng chịt hàng chục luồng nối các Frame chỉ để thể hiện Hover, ta thiết lập tương tác ngay TRONG nội bộ Component:
- **Button:** Nối variant `Default` sang `Hover`. Trigger: `While hovering`. Animation: `Smart Animate`, `150ms`.
- **Dropdown:** Nối variant `Closed` sang `Open`. Trigger: `On click`. Mở dạng Menu xổ xuống với vi chuyển động (Micro-animation).

## 4. Scroll Behavior (Hành vi Cuộn)
- **Header:** Đặt Header cố định khi cuộn màn hình. (Chọn Header Layer -> Constraints -> Fix position when scrolling).
- **Map / Chart:** Khu vực bản đồ có thể đặt `Horizontal Scrolling` để mô phỏng thao tác vuốt ngang xem dữ liệu trên Mobile.
