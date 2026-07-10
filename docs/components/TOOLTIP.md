# Tooltip Component (Chú giải công cụ)

## Khi nào sử dụng
Dùng để giải thích hoặc mô tả ngắn gọn một thành phần nhỏ trên giao diện (Ví dụ: Một nút bấm chỉ có Icon, một thuật ngữ khó hiểu). Nó xuất hiện khi con trỏ chuột dừng lại (Hover) phía trên đối tượng đó trong một khoảng thời gian ngắn.
Lưu ý: Không chứa thông tin quan trọng sống còn, vì Tooltip cực kỳ khó/không thể sử dụng trên thiết bị cảm ứng (Mobile).

## Kích thước
- Box nhỏ xíu, thu mình ôm sát nội dung (Fit-content).

## Typography
- Rất nhỏ. `text-xs` (12px) hoặc `text-sm` (14px).
- Font `Medium` (500) hoặc `Regular`.
- Dòng chữ không được dài quá, ngắt dòng (word-wrap) nếu cần.

## Radius
- Bám sát UI chung nhưng gọn gàng: `4px` (`rounded-sm`) hoặc `6px`.

## Shadow
- Bóng nhẹ: `shadow-md`.

## Padding
- Siêu nhỏ: Trái phải `px-3`, Trên dưới `py-1.5`.

## Trạng thái & Hoạt ảnh (Animation/States)
- **Kích hoạt:** Sau khi hover tĩnh trong khoảng `200ms - 400ms` (Tránh Tooltip nhấp nháy liên tục khi lướt chuột nhanh ngang qua màn hình).
- **Xuất hiện (Enter):** Scale-in nhẹ (`scale 0.95 -> 1`) và Fade-in.
- **Vị trí (Positioning):** Sử dụng hệ thống Radix/Floating UI để tự động tránh tràn viền màn hình (Tooltip tự lật từ Trên xuống Dưới nếu đụng cạnh trên màn hình).

## Ánh sáng (Modes)
- **Đảo ngược màu (Inverted):** Để tách biệt với UI tĩnh.
  - Ở Light Mode: Tooltip có nền Đen/Xám tối (`bg-slate-900`), chữ Trắng.
  - Ở Dark Mode: Tooltip có nền Xám sáng hơn một chút (`bg-slate-800`), hoặc Đen tuyền có viền (`border-slate-700`).

## Accessibility
- Kích hoạt Tooltip không chỉ bằng Hover chuột mà phải hiện ra khi đối tượng nhận được tiêu điểm (Focus) từ bàn phím (Keyboard Tab).
- Tooltip không nên chặn việc click vào các nút khác.
- Screen reader đọc được thông tin Tooltip thông qua `aria-describedby` đặt trên nút chính.
