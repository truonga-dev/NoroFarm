# Card Component (Thẻ)

## Khi nào sử dụng
Dùng để nhóm các thông tin liên quan lại thành một khối trực quan, độc lập. Thường dùng trong Dashboard (Card Thống kê), Trang Tin tức (News Card), hoặc hiển thị Giá (Price Card).

## Kích thước
- Card linh hoạt, chiều rộng co giãn theo Grid Container. Không set chiều rộng cứng (hard-coded width).
- Chiều cao có thể linh hoạt theo nội dung, hoặc cố định `h-full` nếu nằm chung một hàng trong Grid.

## Typography
- **Card Title (Tiêu đề):** `text-lg font-semibold`.
- **Card Description (Mô tả):** `text-sm text-muted-foreground`.
- **Card Content:** Text tùy biến (như Giá nông sản siêu to `text-4xl`).

## Radius
- Mặc định: `12px` (`rounded-xl`) hoặc `16px` (`rounded-2xl`) tạo cảm giác hiện đại như ứng dụng iOS.

## Shadow
- **Mặc định:** Shadow siêu nhẹ `shadow-sm`, hoặc chỉ dùng 1 đường viền mảnh `border border-border` thay vì shadow.
- **Hover:** Nếu Card có thể click (Link tới chi tiết), khi Hover sẽ nổi lên với `shadow-md` và dịch lên trên `translate-y-[-2px]`.

## Padding
- **Bên trong (Card Content):** Mặc định `24px` (`p-6`) cho Desktop.
- **Mobile:** Giảm xuống `16px` (`p-4`) để tiết kiệm không gian màn hình nhỏ.

## Trạng thái (States)
- **Hover:** 
  - (Đối với Interactive Card) Bừng sáng nhẹ lớp viền hoặc tăng Shadow.
  - (Đối với Static Card) Không có hiệu ứng Hover.
- **Focus:** Viền Ring màu Primary nếu Card là một Link truy cập được bằng bàn phím.
- **Active:** Bị lún (scale down) giống Button nếu Card là một action.
- **Disabled:** Mờ đi (`opacity-50`), loại bỏ thuộc tính click.
- **Loading:** Hiển thị Skeleton thay thế cho toàn bộ phần lõi (Content) của Card.

## Ánh sáng (Modes)
- **Light Mode:** Nền Trắng tinh `bg-white` hoặc xám rất nhạt `bg-slate-50`. Viền xám `border-slate-200`.
- **Dark Mode:** Nền đen nhánh `bg-slate-950` hoặc Xám đen `bg-slate-900`. Không dùng Shadow, chỉ dùng viền nổi `border-slate-800`.

## Accessibility
- Nếu toàn bộ Card click được, phải bọc bằng thẻ `<a>` hoặc `<button>`. Hoặc gắn Link vào tiêu đề Card (giữ nguyên cấu trúc ngữ nghĩa HTML) và dùng thủ thuật CSS (pseudo-element) để mở rộng vùng click ra toàn thẻ.
