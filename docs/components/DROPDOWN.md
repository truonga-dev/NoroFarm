# Dropdown Menu Component (Trình đơn thả xuống)

## Khi nào sử dụng
Dùng để nhóm một loạt các Hành động (Actions) phụ thuộc vào một Trigger (Ví dụ: Bấm vào Avatar góc phải màn hình để xổ ra menu Cài đặt, Đăng xuất; Hoặc bấm vào dấu `...` ở góc bài viết để chọn Xóa, Sửa, Báo cáo).
Khác với Select (Dùng để nhập form), Dropdown Menu chứa các đường link hoặc nút thao tác (Command).

## Kích thước
- Độ rộng menu (Panel): Không quá rộng (Tối thiểu `180px`, tối đa khoảng `220px`).
- Item (Nút bấm bên trong): Chiều cao `32px` (`h-8`), đủ rộng cho chuột bấm nhanh.

## Typography
- **Menu Item:** `text-sm font-medium` (14px).
- **Label (Tiêu đề nhóm nhỏ bên trong menu):** `text-xs font-semibold uppercase text-muted-foreground` (12px).
- **Phím tắt (Shortcut hint):** Nằm ở phía đối diện của chữ, màu nhạt (`text-xs text-muted-foreground`). Ví dụ: `Cài đặt        ⌘S`.

## Radius
- **Menu Panel:** `8px` (`rounded-md`).
- **Menu Item:** `4px` (`rounded-sm`). Để khi Hover, vùng sáng (highlight) ôm gọn gàng bên trong Panel.

## Shadow
- Độ cao cực đại (Elevation 3): `shadow-lg` hoặc `shadow-xl`.

## Padding
- **Menu Panel:** Margin ngoài `p-1`.
- **Menu Item:** `px-2 py-1.5`.
- **Gạch ngang chia nhánh (Separator):** Margin `my-1`. Cao `1px`, màu `bg-border`.

## Trạng thái & Hoạt ảnh (States/Animation)
- **Mở (Enter):** Bật ra với animation Zoom-in nhẹ (`scale-95 -> 100`) trong `150ms`.
- **Đóng:** Fade-out nhanh chóng (`100ms`).
- **Hover (Item):** Nền item đổi sang màu Primary mờ (Ví dụ: `bg-slate-100` trong Light mode), Text giữ nguyên hoặc đậm lên. KHÔNG sử dụng màu viền để Hover.
- **Danger Item (Xóa):** Khi hover, chữ và viền hoặc icon có màu Đỏ (`text-destructive`), nền đỏ siêu nhạt (`bg-red-100`).

## Ánh sáng (Modes)
- **Light Mode:** Nền menu Trắng `bg-white`, viền mảnh `border-border`.
- **Dark Mode:** Nền menu Đen xám `bg-slate-900`, viền `border-slate-800`. Hover nền `bg-slate-800`.

## Accessibility
- Giống Tooltip/Select, sử dụng Floating UI engine để menu tự động né mép màn hình.
- Keyboard: Phím `Arrow Down` & `Arrow Up` để điều hướng lên xuống trong menu. Phím `Enter` để thực thi, `Esc` để đóng.
- Focus: Trap focus trong bảng Menu cho đến khi bị đóng.
