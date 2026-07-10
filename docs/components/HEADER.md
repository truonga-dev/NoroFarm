# Header Component (Thanh tiêu đề trên cùng)

## Khi nào sử dụng
Nằm cố định trên cùng màn hình cho mọi trang (Public site). Là điểm neo để người dùng nhận diện thương hiệu, tìm kiếm nhanh và truy cập các trang cốt lõi, dù họ cuộn sâu đến đâu.

## Kích thước
- **Chiều cao:** `64px` (Desktop) / `56px` (Mobile).
- **Chiều rộng:** `100%`, nội dung (Container) bên trong giới hạn max-width `1280px` (để tránh các menu dàn quá xa nhau trên màn hình siêu rộng).

## Typography
- Menu Links (Desktop): `text-sm font-medium` (14px).
- Nút CTA góc phải (Ví dụ: "Tải App"): `text-sm font-semibold`.

## Radius
- Không bo góc. (Trừ các Nút / Input nằm bên trong Header).

## Shadow & Glassmorphism
- **Shadow:** Cực mảnh `border-b border-border` kết hợp bóng siêu nhẹ `shadow-sm` khi cuộn trang. Khi ở đỉnh (top: 0), bỏ shadow để hòa vào nền.
- **Glass Effect (Apple Style):** Bắt buộc. Mọi Header đều ghim `sticky top-0 z-50`. Nền trong suốt 80% (`bg-white/80`) kết hợp mờ nền (`backdrop-blur-md`). Điều này cho phép nội dung cuộn bên dưới hiện lấp ló phía sau cực kỳ sang trọng.

## Padding
- Lề trái phải: `px-4` (Mobile) / `px-8` (Desktop).

## Layout & Trạng thái (Hover/Focus)
- Cấu trúc 3 khối (Flexbox Space-between): 
  - **Left:** Logo NoroFarm.
  - **Center:** Main Navigation (Trang chủ, Giá, Tin Tức). Ở Mobile thì ẩn đi.
  - **Right:** Search Bar, Theme Toggle, CTA Button.
- **Hover Links:** Chữ xám nhạt (`text-muted-foreground`) chuyển sang chữ đen (`text-foreground`). Không có đổi màu nền.

## Ánh sáng (Modes)
- **Light Mode:** `bg-white/80`.
- **Dark Mode:** `bg-slate-950/80`. Text sáng. Mọi hiệu ứng Glassmorphism hoạt động tương tự.

## Accessibility
- Sử dụng thẻ `<header>` và thanh Menu chính bọc trong `<nav>`.
- Có thuộc tính "Skip to main content" ẩn (Chỉ hiện ra khi Tab phím đầu tiên) để người dùng khuyết tật có thể bỏ qua Header và nhảy thẳng vào bài đọc.
