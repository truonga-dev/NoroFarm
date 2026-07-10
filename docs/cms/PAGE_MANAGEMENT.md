# Quản lý Trang (Page Management)

## Mục tiêu
Khung làm việc chung (Dashboard) dành cho việc quản lý toàn bộ các Bài viết, Trang tĩnh, và Landing Page trên hệ thống. 

## Chức năng
- **Bảng điều khiển Trung tâm (Content Hub):** Nơi liệt kê toàn bộ nội dung.
- **Trạng thái Dữ liệu:** Hiển thị rõ ràng các thẻ (Tabs): TẤT CẢ (All), ĐÃ XUẤT BẢN (Published), BẢN NHÁP (Drafts), CHỜ DUYỆT (Pending), LƯU TRỮ (Archived).
- **Thao tác nhanh (Quick Actions):** Di chuột vào bài viết sẽ hiện ra các nút: Chỉnh sửa, Xem trước (Preview), Sao chép (Duplicate), Xóa vào Thùng rác.

## Layout & Giao diện
- Giao diện danh sách dạng Bảng (Table View) là mặc định.
- Cột bao gồm: Tiêu đề, Tác giả, Chuyên mục, SEO Score (Chấm điểm SEO), Ngày cập nhật cuối, Trạng thái.
- Tích hợp thanh tìm kiếm Toàn văn (Full-text search) siêu tốc ở phía trên cùng để lọc bài viết tức thì.

## Trải nghiệm Xem trước (Preview Experience)
- Khi Editor bấm "Xem trước" một Bản nháp, hệ thống không mở sang cửa sổ mới (gây đứt quãng), mà sẽ mở một **Màn hình Trượt (Slide-over / Drawer)** chiếm 80% màn hình, hiển thị trang web mô phỏng để xem nhanh.

## Phân trang & Lọc (Pagination & Filtering)
- Do CMS có thể chứa hàng vạn bài viết qua nhiều năm, dữ liệu BẮT BUỘC phải phân trang (Limit 20-50 bài/trang) kết hợp với các bộ lọc thông minh: "Chỉ hiện bài viết của tôi", "Chỉ hiện bài viết tháng này".
