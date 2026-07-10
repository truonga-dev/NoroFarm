# Bản thiết kế Độ chân thực cao (Hi-Fidelity Design)

Đây là bản mô tả chi tiết giao diện Figma hoàn thiện của NoroFarm (Bản có màu sắc, typography thật, đổ bóng, và dữ liệu mẫu).

## 1. Ngôn ngữ Thiết kế (Visual Language)
Lấy cảm hứng từ Vercel, Linear và Apple:
- **Tone màu chủ đạo:** Tối giản (Minimal). Nền Trắng/Xám nhạt ở Light mode. Cực kỳ ít sử dụng dải màu rực rỡ để tránh làm người dùng mỏi mắt khi xem số liệu lâu.
- **Điểm nhấn (Accent):** Màu Xanh Ngọc (Emerald) chỉ xuất hiện ở Nút bấm quan trọng, Icon đang Active, và chỉ báo tăng giá.
- **Border & Shadow:** Sử dụng viền cực mỏng `1px` màu `slate-200` và đổ bóng mềm, siêu nhẹ (Soft shadow) để tạo độ sâu, không dùng khối nổi 3D nặng nề.

## 2. Chi tiết các Section chính (Desktop)

### Top Navigation (Header)
- **Background:** Trắng đục (Translucent) + Hiệu ứng `Background Blur` (Kính mờ - Glassmorphism) thông số Blur: `12px`.
- **Border Bottom:** `1px solid #E2E8F0`.
- **Logo:** Góc trái, Font Inter/Outfit đậm, chữ NoroFarm.
- **Menu:** Căn giữa, Font Inter, Size 14px, Trọng lượng Medium, Màu Text `#64748B`. Khi Hover: Đổi màu đen `#0F172A`.

### Bảng Giá (Price Card)
- **Container:** Nền `#FFFFFF`, Bo góc (Radius) `12px`, Border `1px solid #E2E8F0`. Shadow: `0px 4px 6px rgba(0,0,0,0.02)`.
- **Header Card:** Có Icon Nhánh Cà phê nhỏ, chữ `Cà phê Robusta` in đậm (`#0F172A`).
- **Data Rows:** Mỗi dòng của tỉnh (Vd: Đắk Lắk) có chiều cao `56px`. Nền khi Hover đổi thành `#F8FAFC`.
- **Số liệu:** Cỡ chữ `16px`, dùng Font Tabular (Số cách đều nhau để bảng giá không bị thò thụt). Màu Xanh `#10B981` kèm Icon Mũi tên lên (Tăng giá).

### Widget Thời tiết
- **Background:** Gradient nhẹ góc chéo. Nếu trời mưa: `#1E293B` sang `#0F172A` (Nền tối ngay cả ở Light Mode để tạo độ tương phản mạnh).
- **Text Nhiệt độ:** Cỡ cực lớn `48px`, mỏng (Light), màu Trắng.
- **Icon:** Vector đám mây sắc nét, màu Xám trắng và Hạt mưa xanh lơ.
