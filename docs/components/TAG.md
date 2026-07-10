# Tag Component (Thẻ nhãn)

## Khi nào sử dụng
Tag thường dễ nhầm lẫn với Badge. Khác biệt cốt lõi: **Tag CÓ THỂ TƯƠNG TÁC (Click, Xóa, Lọc)**.
Ví dụ: Các từ khóa tìm kiếm (Tag), Filter loại nông sản đang bật, Danh mục bài báo.

## Kích thước
- Tương đương với Input cỡ nhỏ.
- Chiều cao `32px` (h-8). Text size `14px`.

## Typography
- Font weight: `Medium` (500). Font thường, không in hoa toàn bộ.

## Radius
- Bo góc vừa phải, thường khớp với bo góc của Input: `8px` (`rounded-md`).

## Shadow
- Không Shadow.

## Padding
- `px-3 py-1`. Đủ không gian để ngón tay chạm vào (Mobile).

## Trạng thái (States)
- **Hover:** Màu nền thay đổi (Đậm hơn 1 tone). Ví dụ: `bg-slate-100` -> `bg-slate-200`.
- **Focus:** Viền Ring xanh lá hiện lên (Phục vụ Navigation bằng phím Tab).
- **Active:** Nút hơi lún xuống.
- **Đóng/Xóa (Dismissible Tag):** Có thêm một nút `[X]` nhỏ xíu bên phải. Khi Hover vào nút `[X]` đó, nền cục bộ của chữ X đổi sang đỏ hoặc xám đậm.

## Ánh sáng (Modes)
- **Light Mode:** Nền xám nhạt (`bg-secondary`), chữ xám đậm.
- **Dark Mode:** Nền xám tối (`bg-secondary`), chữ sáng. Cả 2 chế độ đều không có viền (borderless).

## Accessibility
- Đối với Tag có nút [X] (Xóa tag), nút đó bắt buộc phải bọc bằng thẻ `<button>` và có `aria-label="Xóa [tên tag]"`.
- Hỗ trợ nhấn `Delete` hoặc `Backspace` khi focus vào Tag để xóa.
