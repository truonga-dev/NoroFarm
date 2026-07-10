# Hệ thống Quản trị Nội dung (CMS Guidelines)

## Mục tiêu
Tài liệu này tập trung sâu vào Trải nghiệm Soạn thảo và Quy trình Xuất bản Nội dung (Content Workflow) của các Biên tập viên (Editors) trên NoroFarm. Khác với tài liệu `docs/admin` (tập trung vào cấu trúc hệ thống và luồng dữ liệu kỹ thuật), thư mục `docs/cms` đi sâu vào khía cạnh UX/UI của công cụ soạn thảo, quản lý phiên bản bài viết và các bước phê duyệt nội dung.

## Đối tượng sử dụng
- **Biên tập viên (Editors):** Người trực tiếp viết bài, tạo trang, tải ảnh.
- **Tổng biên tập (Chief Editor / Content Manager):** Người kiểm duyệt, hẹn giờ xuất bản và quản lý chất lượng.
- **Frontend / UI UX Designer:** Người thiết kế và code giao diện cho trình soạn thảo (Rich Text Editor).

## Triết lý thiết kế CMS
1. **Focus Mode (Chế độ tập trung):** Khi Editor bắt đầu gõ chữ, mọi thanh menu xung quanh phải mờ đi hoặc biến mất để tạo không gian viết không bị xao nhãng (Distraction-free).
2. **WYSIWYG Thực sự:** (What You See Is What You Get) - Chữ trong trình soạn thảo phải có font và kích thước Y HỆT như khi nó xuất hiện ngoài trang chủ cho độc giả đọc.
3. **An toàn dữ liệu (Data Safety):** Chống mất bài viết khi rớt mạng bằng cơ chế Lưu nháp cục bộ (Local Storage Auto-save).

## Tổ chức Tài liệu
Thư mục này phân rã các tính năng cụ thể của CMS từ Trình soạn thảo Tin tức, Trình tạo trang tĩnh, cho đến cơ chế Lưu lại Lịch sử (Versioning) để Khôi phục bài viết cũ.
