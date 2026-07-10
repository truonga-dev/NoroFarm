# Hệ thống Lưới & Không gian (Grid & Spacing System)

## 1. Hệ thống Lưới Không gian (8pt Grid)
NoroFarm sử dụng hệ thống lưới dựa trên bội số của 8px (đôi khi là 4px cho các chi tiết nhỏ). Điều này giúp tạo ra nhịp điệu (rhythm) nhất quán trên toàn bộ UI.

### Spacing Scale (Tailwind config)
- `0.5`: 2px
- `1`: 4px (Micro spacing, dùng cho icon và text)
- `2`: 8px (Khoảng cách giữa các thành phần nhỏ)
- `3`: 12px
- `4`: 16px (Padding mặc định của nút, thẻ card)
- `6`: 24px
- `8`: 32px (Margin giữa các khối nội dung)
- `12`: 48px
- `16`: 64px (Margin của các section)
- `24`: 96px
- `32`: 128px (Khoảng cách giữa các section lớn ở màn hình desktop)

## 2. Container & Layout
- **Max Width (Desktop):** Giới hạn nội dung ở mức `1280px` (`max-w-7xl` trong Tailwind) để đảm bảo line-length của text luôn ở mức dễ đọc.
- **Center Alignment:** Container luôn được căn giữa với `margin-inline: auto`.
- **Gutter (Padding hai bên):** 
  - Mobile: `16px` (px-4).
  - Tablet: `32px` (px-8).
  - Desktop: `32px` hoặc `48px`.

## 3. Fluid Grid
Đối với các danh sách (như thẻ Tin tức, Danh sách Nông sản), ưu tiên sử dụng CSS Grid kết hợp `auto-fill` hoặc `auto-fit` để tự động điều chỉnh số cột thay vì fix cứng bằng media queries.

Ví dụ logic: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));`
- Mobile: 1 cột.
- Tablet: 2 cột.
- Desktop: 3-4 cột.
