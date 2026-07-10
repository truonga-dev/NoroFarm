# Input Component

## Khi nào sử dụng
Dùng để người dùng nhập văn bản, số, email, mật khẩu... trong các biểu mẫu (Forms).

## Kích thước
- **Small:** Chiều cao `32px`. Text `14px`.
- **Medium (Default):** Chiều cao `40px` (Desktop). Text `14px`.
- **Large (Mobile Touch Target):** Chiều cao `48px`. Text `16px`.

## Typography
- Font weight: `Regular` (400) cho phần text nhập liệu.
- Màu chữ: `text-foreground` (Đậm, dễ đọc).
- Placeholder: `text-muted-foreground` (Màu xám nhạt).

## Radius
- Mặc định: `8px` (`rounded-md`).

## Shadow
- Không shadow. Cấu trúc phẳng với viền mỏng 1px (`border-border`).

## Padding
- Padding Left/Right: `12px` (`px-3`).
- Padding Left lớn hơn nếu có Icon bên trong: `36px` (`pl-9`).

## Trạng thái (States)
- **Hover:** Đổi màu viền (Border) thành đậm hơn một chút (ví dụ `border-slate-400`).
- **Focus:** 
  - Viền đổi sang màu Primary (`border-emerald-500`).
  - Xuất hiện Ring phát sáng bao quanh (`ring-2 ring-emerald-500/20`).
- **Active:** Tương tự Focus.
- **Disabled:** 
  - Nền chuyển sang xám nhạt (`bg-slate-100`). 
  - Opacity chữ giảm 50%.
  - Bỏ hiệu ứng Hover.
- **Loading:**
  - Dùng trong trường hợp search input. Hiện Icon spinner góc phải.

## Ánh sáng (Modes)
- **Light Mode:** Nền Input trắng `bg-white`, viền xám nhạt `border-slate-200`.
- **Dark Mode:** Nền Input trong suốt `bg-transparent` hoặc xám đen `bg-slate-900`, viền `border-slate-800`.

## Accessibility
- Bắt buộc đi kèm với thẻ `<label>` được liên kết qua thuộc tính `id`.
- Khi focus bằng bàn phím (Tab), Input phải hiển thị viền/ring rõ ràng.
- `type` attribute phải chuẩn (VD: `type="email"` để hiển thị đúng bàn phím ảo trên di động).
