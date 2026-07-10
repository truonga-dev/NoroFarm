# Pagination Component (Phân trang)

## Khi nào sử dụng
Dùng khi danh sách dữ liệu quá dài không thể hiển thị trên một trang (Ví dụ: Lịch sử tin tức, Danh sách bảng giá quá khứ hàng nghìn ngày). Phân trang giúp tách nhỏ dữ liệu thành các phần dễ quản lý hơn và cải thiện tốc độ tải trang.
Lưu ý: Đối với Mobile và dạng feed (như bài viết trên mạng xã hội), nên sử dụng Nút "Tải thêm" (Load More) hoặc Cuộn vô tận (Infinite Scroll) thay vì Phân trang truyền thống (các con số) để tránh chạm nhầm.

## Kích thước
- Nút phân trang (Nút số, nút Previous/Next): Dùng chuẩn hình vuông hoặc tròn (`size-9` hoặc `size-10`).
- Dàn ngang ở giữa (Centered) hoặc căn phải (`justify-end`) tùy cấu trúc bảng bên trên.

## Typography
- Text của con số: `text-sm font-medium`.
- Icon chuyển trang: Dùng `Lucide: ChevronLeft` và `ChevronRight`.

## Radius
- Các nút con (Button items): Tương đương Button chung (`rounded-md` 8px).

## Shadow
- Không đổ bóng (Flat).

## Padding
- Nút số: `p-0` (Căn chữ giữa Box `size-9` dùng flexbox trung tâm).
- Nút Previous/Next (có chữ thay vì icon): Giống kích thước Button `px-4`.

## Trạng thái (States)
- **Hover:** Tương tự nút Button outline (Nền xám nhạt `bg-slate-100`).
- **Focus:** Outline viền xanh (Ring) để bàn phím điều hướng được.
- **Active (Trang hiện tại):** Nút đổi màu. Hoặc là màu nổi bật như Button Primary (`bg-emerald-500 text-white`), Hoặc tối giản bằng cách thêm viền viền bao quanh (Border outline nổi bật) `border-emerald-500 bg-emerald-50 text-emerald-900`.
- **Disabled (Không bấm được):** Nút "Trang trước" bị mờ đi khi đang ở trang 1. Chuột biến thành dấu cấm (`not-allowed`).

## Ánh sáng (Modes)
- **Light Mode:** Các nút mặc định trong suốt `bg-transparent`, khi hover xám nhạt `bg-slate-100/50`. Nút trang hiện tại màu Đen hoặc Xanh.
- **Dark Mode:** Các nút trong suốt, hover xám tối `bg-slate-800/50`. Nút trang hiện tại màu Sáng (Trắng/Xanh).

## Accessibility
- Vùng chứa toàn bộ component phân trang phải có thẻ `<nav aria-label="Pagination">`.
- Nút trang hiện tại cần có `aria-current="page"` để trình đọc màn hình nhấn mạnh đây là vị trí đang đứng.
- Nút "Trước" và "Sau" phải có text mô tả rõ ràng như `aria-label="Tới trang trước đó"`.
