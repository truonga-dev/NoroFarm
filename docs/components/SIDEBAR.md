# Sidebar Component (Thanh bên)

## Khi nào sử dụng
Dùng trong Giao diện Quản trị (Admin CMS) hoặc Layout Dashboard Desktop. Cung cấp bộ menu điều hướng chính xuyên suốt các trang. Chứa các nhóm tính năng độc lập (Trang chủ, Quản lý Tin tức, Cài đặt).
Không sử dụng trên giao diện Khách (Public Landing Page) để tối ưu không gian màn hình.

## Kích thước
- Chiều rộng cố định: `250px` (Mở rộng/Expanded) hoặc `80px` (Thu gọn/Collapsed - Chỉ hiện Icon).
- Chiều cao: Kéo dài 100% chiều cao màn hình (`h-screen`). Dính chặt vào cạnh trái (`fixed left-0`).

## Typography
- **Tiêu đề nhóm (Group Label):** `text-xs font-semibold uppercase text-muted-foreground`.
- **Item (Link):** `text-sm font-medium`. Kèm icon bên trái.

## Radius
- Bản thân Sidebar không bo góc (Vuông vắn với màn hình).
- Menu Item bên trong: `8px` (`rounded-md`).

## Shadow
- Không Shadow.
- Phân cách với nội dung chính bằng một đường viền dọc (`border-r 1px solid`).

## Padding
- Container: `p-4` hoặc `px-3 py-4`.
- Menu Item: `px-3 py-2`.

## Trạng thái (States)
- **Active (Đang ở trang đó):** Item được làm nổi bật với nền màu Primary cực nhạt (`bg-emerald-500/10`), chữ và icon màu Primary (`text-emerald-600`).
- **Hover (Item tĩnh):** Nền đổi thành xám nhạt (`bg-slate-100`). Text đậm màu lên (`text-slate-900`).
- **Collapsed (Thu gọn):** Có một nút bấm ở mép dưới để chuyển trạng thái. Khi thu gọn, chữ biến mất (opacity 0), icon căn giữa. Hover vào icon lúc này sẽ hiện Tooltip.

## Ánh sáng (Modes)
- **Light Mode:** Nền Trắng tinh `bg-white`, viền phải xám nhạt `border-border`.
- **Dark Mode:** Nền Đen xám `bg-slate-950` hoặc Xám tối `bg-slate-900`, viền `border-slate-800`.
  - Item Active (Dark): Nền `bg-emerald-500/20`, chữ `text-emerald-400`.

## Accessibility
- Gắn thẻ `<nav>` với `aria-label="Sidebar Navigation"`.
- Trên Mobile, Sidebar biến mất (bị giấu đi) và chuyển thành Hamburger Menu (Sheet / Drawer Component bật ra từ mép trái).
