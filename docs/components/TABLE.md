# Table Component (Bảng dữ liệu)

## Khi nào sử dụng
Dùng để hiển thị danh sách dữ liệu có cấu trúc lưới ngang dọc (Hàng và Cột), giúp dễ so sánh. Ví dụ: Bảng hiển thị giá các loại nông sản theo địa phương, Bảng dữ liệu thống kê tồn kho.

## Kích thước
- Bảng 100% width chứa trong một Card wrapper.
- Hỗ trợ cuộn ngang (`overflow-x-auto`) nếu bảng quá nhiều cột trên màn hình hẹp.

## Typography
- **Tiêu đề cột (Table Head):** `text-sm font-medium text-muted-foreground`. Có thể viết hoa nếu cần trang trọng. Căn chỉnh phải khớp với kiểu dữ liệu bên dưới.
- **Nội dung (Table Cell):** `text-sm` hoặc `text-base`.
- **Dữ liệu Số (Numbers/Prices):** Bắt buộc dùng font `tabular-nums` để các chữ số được canh thẳng hàng với nhau, giúp đối chiếu dọc rất dễ.

## Radius
- Bản thân Table không có bo góc. Wrapper bên ngoài bao bọc Table được bo góc `rounded-lg`.

## Shadow
- Không shadow bên trong table. Wrapper ngoài cùng có thể mang `shadow-sm`.

## Padding
- **Cell Padding:** `px-4 py-3` hoặc `py-4`. Đủ độ cao dòng (Row height) để thoải mái chạm trên Mobile. Khoảng `48px` chiều cao một hàng là đẹp.

## Trạng thái (States)
- **Hover (Row):** Khi lướt chuột qua một Hàng, toàn bộ hàng đó sẽ đổi nền sang xám nhạt (`bg-slate-50/50`) để giúp mắt không bị lạc dòng khi đọc ngang.
- **Focus:** Các Link/Button bên trong bảng có hiệu ứng Focus chuẩn (Ring/Outline).
- **Active:** Nếu hàng có thể click (Clickable row), khi bấm sẽ hiển thị màu nền khác biệt và chuyển trang.
- **Disabled:** Hàng bị vô hiệu hóa chữ mờ đi, background màu xám nhạt (`bg-slate-100`).
- **Loading:** Bảng tải dữ liệu hiển thị các khung Skeleton dài bằng đúng cấu trúc hàng/cột tương ứng thay vì dữ liệu trống.

## Ánh sáng (Modes)
- **Light Mode:** Đường phân cách (`border-b`) màu xám nhạt `border-slate-200`. Chữ chính màu `slate-900`.
- **Dark Mode:** Đường phân cách màu `border-slate-800`. Hover dòng màu `bg-slate-800/50`. Chữ màu `slate-50`.

## Accessibility
- Sử dụng đầy đủ cấu trúc semantic HTML: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`.
- Hỗ trợ Scope cho thẻ Header: `<th scope="col">` để trình đọc màn hình hiểu hướng dóng của cột dữ liệu.
- Không dùng Table để tạo Layout, chỉ dùng để chứa Dữ liệu (Tabular data).
