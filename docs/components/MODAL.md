# Modal Component (Cửa sổ bật lên / Dialog)

## Khi nào sử dụng
Dùng để chặn luồng thao tác hiện tại của người dùng, yêu cầu họ phải tập trung vào một nhiệm vụ khép kín. Ví dụ: Xác nhận Xóa dữ liệu, Điền form Liên hệ nhanh. Tránh lạm dụng để hiển thị thông tin đơn giản.

## Kích thước
- **Container (Background Overlay):** Chiếm `100vw` và `100vh`, cố định (`fixed inset-0`).
- **Modal Box:** 
  - Mobile: Rộng gần full màn hình (Width `calc(100% - 32px)`).
  - Desktop: Kích thước phổ biến là `max-w-md` (448px), `max-w-lg` (512px). Không nên quá to trừ khi chứa bảng dữ liệu.

## Typography
- **Tiêu đề (Dialog Title):** `text-lg font-semibold`.
- **Mô tả (Dialog Description):** `text-sm text-muted-foreground` nằm ngay dưới tiêu đề.

## Radius
- Bo góc mạnh để hiện sự phân tách với màn hình chính: `16px` (`rounded-2xl`) hoặc `12px` (`rounded-xl`).

## Shadow
- Độ cao cực đại (Elevation 3): `shadow-2xl`. Bắt buộc phải có bóng đổ mạnh để tách biệt lớp hiển thị.

## Padding
- Mặc định: `24px` (`p-6`) cho toàn bộ Box.

## Trạng thái (States)
- **Hover:** Tương tác như form thông thường. Nút tắt (X) ở góc trên bên phải có hover `bg-slate-100`.
- **Focus:** 
  - Khi Modal bật lên, focus phải LẬP TỨC chuyển vào một thành phần an toàn bên trong Modal (VD: Nút Cancel hoặc Input đầu tiên).
  - Focus bị giam giữ (Focus Trap) - Không thể dùng phím Tab di chuyển ra khỏi Modal.
- **Active:** Modal xuất hiện với hiệu ứng Zoom-in nhẹ (`scale: 0.95 -> 1`) và Fade-in (`opacity 0 -> 1`) trong `200ms`. Backdrop tối đi mượt mà.
- **Disabled:** Nếu đang thao tác lưu dữ liệu, mọi nút bấm trong Modal phải mờ đi.
- **Loading:** Cấm đóng (X) nếu đang chờ dữ liệu xử lý.

## Ánh sáng (Modes)
- **Background Overlay (Lớp phủ mờ):** Xám đen trong suốt (`bg-black/80` hoặc `backdrop-blur-sm`). Cả hai mode Light/Dark đều dùng lớp phủ tối.
- **Light Mode:** Modal màu Trắng `bg-white`, viền 1px `border-border`.
- **Dark Mode:** Modal màu Đen/Xám đậm `bg-slate-950`, viền `border-slate-800`.

## Accessibility
- Sử dụng chuẩn ARIA (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="..."`).
- Hỗ trợ đóng Modal bằng phím `Escape`.
- Click ra ngoài vùng Overlay phải tự động đóng Modal (trừ khi là Form bắt buộc điền).
