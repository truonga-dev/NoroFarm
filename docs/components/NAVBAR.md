# Navbar Component (Thanh điều hướng Mobile / Bottom Nav)

## Khi nào sử dụng
Được sử dụng độc quyền trên giao diện Mobile thay thế cho Top Header Navigation (vì thanh menu trên cùng ở Mobile không thể chứa đủ các link). Nó nằm sát đáy màn hình (Bottom Edge), cho phép người dùng điều hướng nhanh chóng bằng ngón tay cái (Thumb zone). 

## Kích thước
- Chiều cao cố định: `64px` (`h-16`) (Phù hợp để ngón tay bấm mà không bị chạm nhầm (Fat finger)).
- Chiều rộng 100% màn hình, ghim đáy (`fixed bottom-0 z-50`).

## Typography
- Label cực kỳ nhỏ: `text-[10px]` hoặc `text-xs` (12px).
- Font `Medium` (500).

## Radius & Padding
- Bo góc: Bằng 0. Gắn sát mép dưới điện thoại.
- Lưu ý Padding Bottom (Safe Area): Trên iPhone có thanh Home Indicator dưới đáy. Cần CSS `padding-bottom: env(safe-area-inset-bottom)` để các nút bấm không bị chèn lên thanh vuốt của iOS.
- Layout: Chia đều thành 4 hoặc 5 cột (CSS Grid `grid-cols-4` hoặc Flexbox `justify-around`). 

## Trạng thái (States) & Icon
Chủ đạo của Navbar là Icon + Label nhỏ nằm dưới.
- **Tĩnh (Inactive):** Icon `size-6`, độ dày nét `stroke-1.5`. Cả Icon và Label màu Xám nhạt (`text-muted-foreground`).
- **Bấm (Active / Current Page):** 
  - Icon đổi sang màu Primary (Emerald-500). 
  - Nét vẽ dày hơn một chút (Fill màu hoặc `stroke-2`).
  - Label hiện rõ đậm.
- **Hoạt ảnh (Animation):** Khi bấm, nút lún nhẹ (scale-95) và Icon nhún (Bounce nhẹ) để tạo sự thích thú (Delightful UI).

## Shadow & Glassmorphism
- Phải có Glassmorphism y hệt Header (`bg-white/80 backdrop-blur-md`).
- Viền trên mảnh (`border-t border-border`) để tách biệt khỏi nội dung đang cuộn xuống dưới.

## Ánh sáng (Modes)
- Light/Dark mode kế thừa từ Header. Nền kính mờ trong suốt, chữ và Icon tự động lật màu Xám/Sáng.

## Accessibility
- Dùng thẻ `<nav>`. Mọi nút bấm (Item) bên trong là thẻ `<a>` và phải mang thuộc tính `aria-label` tương ứng (Ví dụ: `aria-label="Trang chủ"`).
- Số lượng nút tối đa: 5. Nếu có 6 tính năng, tính năng thứ 5 sẽ là nút "Thêm/Khác" để mở Menu đầy đủ (Drawer).
