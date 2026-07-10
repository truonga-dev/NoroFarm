# Button Component

## Khi nào sử dụng
Dùng để kích hoạt một hành động. Ví dụ: Lưu dữ liệu, Gửi form, Chuyển trang chính.

## Kích thước
- **Small:** Chiều cao `32px`. Text `14px`. Padding `0 12px`.
- **Medium (Default):** Chiều cao `40px`. Text `14px` (hoặc `16px`). Padding `0 16px`.
- **Large:** Chiều cao `48px`. Text `16px`. Padding `0 24px`.
- **Icon-only:** Chiều rộng = Chiều cao (`size-10` cho Medium).

## Typography
- Font weight: `Medium` (500) hoặc `SemiBold` (600).
- Không gạch chân, không in hoa toàn bộ (No all-caps).

## Radius
- Mặc định: `8px` (`rounded-md`).
- Pill button (Nút bo tròn hoàn toàn): `9999px` (`rounded-full`).

## Shadow
- Mặc định: Không có shadow để giữ phong cách Flat.

## Padding
- Trái/Phải (X): Tùy kích thước (12px, 16px, 24px).
- Giữa Icon và Text: `8px` (`gap-2`).

## Trạng thái (States)
- **Hover:** Thay đổi độ sáng của màu nền. Primary (Emerald) giảm sáng 10% (`hover:bg-emerald-600`).
- **Focus:** 
  - Hiển thị viền báo hiệu (Ring) bao quanh nút. 
  - `ring-2 ring-emerald-500 ring-offset-2`.
- **Active (Bấm xuống):** 
  - Nút lún nhẹ (`scale-[0.98]`). Thời gian chuyển động `duration-100`.
- **Disabled:** 
  - Opacity giảm còn `50%`. 
  - Con trỏ chuột đổi thành `not-allowed`.
  - Không có hiệu ứng Hover hay Active.
- **Loading:**
  - Chữ mờ đi hoặc biến mất, hiển thị Spinner quay tròn ở chính giữa hoặc bên trái chữ.
  - Vẫn giữ trạng thái click bị vô hiệu hóa để tránh double submit.

## Ánh sáng (Modes)
- **Light Mode:** Nút Primary dùng mã Emerald nguyên bản. Chữ màu Trắng.
- **Dark Mode:** Nút Primary có thể giữ nguyên mã Emerald hoặc tăng độ sáng (Lightness) lên 5% để nổi bật hơn trên nền đen.

## Accessibility
- Bắt buộc có thuộc tính `aria-label` nếu là nút Icon-only.
- Tỷ lệ tương phản chữ/nền tối thiểu 4.5:1.
- Hỗ trợ thao tác bằng phím `Enter` và `Space`.
