# Select Component (Dropdown Menu)

## Khi nào sử dụng
Dùng khi người dùng cần chọn MỘT (hoặc nhiều) giá trị từ một danh sách cố định có sẵn. Ví dụ: Chọn Tỉnh/Thành, Chọn Loại nông sản.

## Kích thước
- **Trigger (Nút bấm mở select):** Kích thước tương đồng với Input Component (Chiều cao `40px` mặc định).
- **Dropdown List (Bảng danh sách):** Chiều rộng bằng đúng với Trigger hoặc tự động co giãn theo nội dung. Chiều cao tối đa (Max-height) là `300px`, nếu dài hơn sẽ hiển thị thanh cuộn (Scrollbar).

## Typography
- Kích thước chữ: Bằng với kích thước Input (`14px` hoặc `16px`).
- Item đang được chọn (Selected): Có thể in đậm chữ (`font-medium`) hoặc hiện Icon Check mark.

## Radius
- Trigger: `8px` (`rounded-md`).
- Dropdown Panel: `8px` (`rounded-md`).

## Shadow
- Trigger: Không có.
- Dropdown Panel: Phải nổi bật lên trên toàn bộ UI, sử dụng `shadow-md` hoặc `shadow-lg` (Elevation cao).

## Padding
- Trigger: `px-3 py-2`.
- Dropdown Panel: `p-1` (Padding ngoài).
- Dropdown Item: `px-2 py-1.5` (Khoảng cách chạm ngón tay).

## Trạng thái (States)
- **Hover (Trigger):** Tương tự Input, viền đậm màu lên.
- **Hover (Item trong List):** Màu nền của item thay đổi (`bg-slate-100`), không thay đổi viền.
- **Focus (Trigger):** Viền sáng lên (Primary Ring) khi điều hướng bằng phím Tab.
- **Active:** List mở ra với hiệu ứng xổ xuống (Dropdown animate-in).
- **Disabled:** Trigger bị mờ đi `opacity-50`, không thể mở list.
- **Loading:** Bảng danh sách hiển thị Text "Đang tải dữ liệu..." hoặc Skeleton.

## Ánh sáng (Modes)
- **Light Mode:** Bảng Dropdown nền trắng, viền `border-slate-200`. Hover item nền xám nhạt `bg-slate-100`.
- **Dark Mode:** Bảng Dropdown nền `bg-slate-900`, viền `border-slate-800`. Hover item nền xám tối `bg-slate-800`.

## Accessibility
- Hỗ trợ đầy đủ điều hướng bằng bàn phím: Mũi tên Lên/Xuống để duyệt danh sách, `Enter` để chọn, `Esc` để đóng.
- Có thuộc tính `aria-expanded` để báo hiệu cho Screen Reader biết Dropdown đang mở hay đóng.
