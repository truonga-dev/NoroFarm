# Dark Mode Specification

NoroFarm Dark Mode lấy cảm hứng từ phong cách Linear và Vercel: Sâu thẳm, tương phản cao, và không dùng màu đen tuyền ở mọi nơi.

## 1. Nền (Backgrounds)
- **Body Background:** Khuyến nghị dùng màu rất tối nhưng có độ ấm hoặc lạnh (VD: `#0A0A0A` - Neutral Black). Tránh dùng pure black `#000000` trừ khi cho màn hình OLED.
- **Surface Background:** Thẻ Card và modal dùng màu sáng hơn lớp nền chính 1-2 bậc (VD: `#171717` hoặc `#1C1C1C`).

## 2. Đường viền (Borders)
Trong Dark Mode, shadow rất khó nhìn thấy, do đó UI phân tách không gian chủ yếu thông qua **Border**.
- Sử dụng border rất mỏng `1px` với màu xám tối (`#27272A` hoặc `#333333`) quanh các thẻ Card.

## 3. Shadows (Đổ bóng)
- Shadow vật lý không hoạt động hiệu quả trong bóng tối. Thay vì shadow đen, đôi khi sử dụng shadow có ánh sáng nhẹ (glow) từ màu Primary để làm nổi bật nút bấm quan trọng.

## 4. Typography Contrast
- Không dùng Text màu trắng tinh `#FFFFFF` trên nền đen vì sẽ gây quầng sáng chói (halation) cho mắt.
- Sử dụng màu xám sáng `#F4F4F5` (Gray-100) cho Text chính và `#A1A1AA` (Gray-400) cho Text phụ.
