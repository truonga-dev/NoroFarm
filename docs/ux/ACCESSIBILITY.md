# Accessibility Guidelines (WCAG)

NoroFarm cam kết mang lại trải nghiệm bình đẳng cho mọi người dùng, đặc biệt là nhóm người dùng lớn tuổi (nông dân) có thị lực kém hoặc thao tác tay chậm. Tuân thủ tiêu chuẩn **WCAG 2.1 AA**.

## 1. Độ tương phản (Contrast Ratio)
- Văn bản thường (Dưới 18px): Tỷ lệ tương phản tối thiểu `4.5:1` so với nền.
- Văn bản lớn (Trên 18px hoặc in đậm): Tỷ lệ tương phản tối thiểu `3:1`.
- UI Components (Borders, Icons): Tương phản tối thiểu `3:1`.
- Tuyệt đối không dùng chữ xám nhạt (Light Gray) trên nền trắng để hiển thị thông tin quan trọng như Giá cả.

## 2. Màu sắc không phải là dấu hiệu duy nhất
- Không phụ thuộc 100% vào màu sắc để truyền tải thông tin.
  - Ví dụ giá tăng: Không chỉ dùng màu Xanh lá, mà phải kèm biểu tượng Mũi tên hướng lên `(↑)` hoặc dấu cộng `(+)`.
  - Giá giảm: Kèm biểu tượng Mũi tên hướng xuống `(↓)` hoặc dấu trừ `(-)`.

## 3. Bàn phím & Focus (Keyboard Navigation)
- Mọi thành phần tương tác (Links, Buttons, Inputs) đều phải có trạng thái Focus rõ ràng.
- `focus-visible`: Khi di chuyển bằng phím `Tab`, sử dụng viền xanh (Ring) 2px nổi bật. Không bao giờ gỡ bỏ outline mà không có thành phần thay thế.

## 4. Kích thước điểm chạm (Touch Targets - Mobile First)
- Mọi nút bấm, link trên Mobile phải có vùng chạm tối thiểu là `44x44px` hoặc `48x48px` (Chuẩn Apple HIG / Google Material).
- Đảm bảo khoảng cách an toàn (Spacing) giữa các nút để tránh chạm nhầm (Fat-finger errors).

## 5. Screen Readers (Trình đọc màn hình)
- Hình ảnh/Icon mang tính trang trí: Dùng `aria-hidden="true"`.
- Hình ảnh/Icon chức năng: Bắt buộc có `alt text` hoặc `aria-label`.
- Form inputs bắt buộc có thẻ `<label>` liên kết qua ID.
