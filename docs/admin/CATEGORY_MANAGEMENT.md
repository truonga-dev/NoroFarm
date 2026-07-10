# Quản lý Danh mục (Category Management)

## Mục tiêu
Hệ thống cây phân cấp (Hierarchical Tree) để tổ chức và phân loại mọi nội dung trong hệ thống, từ Tin tức, Câu hỏi thường gặp (FAQ) cho đến Cửa hàng (Marketplace) sau này.

## Chức năng
- **Quản lý Cây Danh mục (Tree Manager):** Thêm, Sửa, Xóa danh mục. Hỗ trợ Danh mục cha (Parent) và Danh mục con (Child) không giới hạn độ sâu (N-levels deep). Tuy nhiên khuyến khích chỉ dùng 2-3 cấp.
- **Sắp xếp (Ordering):** Kéo thả (Drag & Drop) để sắp xếp thứ tự hiển thị của danh mục trên thanh Menu trang người dùng.
- **Trạng thái (Visibility):** Ẩn/Hiện danh mục.
- **SEO Danh mục:** Khai báo Tiêu đề và Mô tả SEO riêng cho từng Danh mục.

## Layout
- Giao diện Chia đôi (Split View).
- Cột trái: Cây danh mục (Tree View) dạng thư mục có thể mở rộng (Expand/Collapse).
- Cột phải: Form chi tiết (Detail Form) của Danh mục đang được chọn bên trái.

## UI / UX
- **UI:** Cây danh mục hiển thị gọn gàng giống cấu trúc thư mục của Windows/MacOS.
- **UX:** Kéo thả siêu mượt (Smooth Drag-and-Drop) để thay đổi cấp bậc (Ví dụ kéo Danh mục "Cà phê" nhét vào trong Danh mục "Nông sản"). Form tự động lưu khi có thay đổi (Debounce Auto-save).

## Quyền truy cập
- `category:manage` (Editor, Manager).

## Validation
- Tên danh mục bắt buộc, độ dài tối đa 50 ký tự.
- Cảnh báo Vòng lặp (Circular Dependency Rule): Không thể gán Danh mục A làm con của B, trong khi B lại đang là con của A. 

## Luồng xử lý (Kéo thả)
1. Admin kéo Danh mục "Phân bón" thả vào làm con của Danh mục "Kỹ thuật".
2. Component UI bắt sự kiện `onDrop`.
3. Gửi API `PATCH` cập nhật `parent_id` của "Phân bón" thành ID của "Kỹ thuật". Đồng thời cập nhật trường `sort_order`.
4. Backend xử lý dữ liệu và dọn Cache của cây Menu Navigation trên Frontend.

## API liên quan
- `GET /api/v1/admin/categories` (Lấy toàn bộ cây).
- `POST /api/v1/admin/categories`
- `PUT /api/v1/admin/categories/reorder` (API cập nhật hàng loạt cho tính năng Kéo thả).

## Database liên quan
- Bảng `categories`. Cấu trúc Self-Referencing (`parent_id` tham chiếu đến chính `id` của bảng).
- Cần sử dụng thuật toán CTE (Common Table Expressions - `WITH RECURSIVE`) trong PostgreSQL để lấy nguyên một cây danh mục cực kỳ nhanh và chỉ tốn 1 lần Query.

## Responsive
- Tính năng Kéo Thả (Drag/Drop) rất rườm rà trên Màn hình cảm ứng. Nếu người dùng dùng Mobile, vô hiệu hóa Kéo Thả, thay bằng các nút (Mũi tên Lên/Xuống) để sắp xếp vị trí.

## Security
- Chống Xóa các Danh mục Đặc biệt (System Categories). (Ví dụ: Danh mục "Tin thị trường" được System ghim cứng). Cấm Xóa, nếu Cố tình xóa sẽ ném lỗi.

## Error Handling
- Lỗi xóa Danh mục đang chứa Bài viết: Nếu Admin xóa Danh mục "A", hệ thống phải hỏi: "Danh mục này đang chứa 150 bài viết. Bạn muốn Xóa luôn bài viết hay Di chuyển bài viết sang danh mục Khác?". (Nguyên tắc an toàn dữ liệu).
