# Trình quản lý Đa phương tiện (Media Manager)

## Mục tiêu
Trình duyệt file (File Explorer) tích hợp trực tiếp bên trong CMS để quản lý Hình ảnh, Tài liệu.

## Trải nghiệm Người dùng (UX)
- Giao diện có 2 chế độ xem: Lưới (Grid View - Xem Thumbnail lớn) và Danh sách (List View - Xem Tên file và Dung lượng).
- **Hỗ trợ Kéo Thả (Dropzone):** Người dùng có thể kéo thả cùng lúc 10-20 bức ảnh từ Desktop thẳng vào cửa sổ CMS. Một màn hình mờ (Overlay) sẽ hiện lên với dòng chữ "Thả ảnh vào đây để tải lên".

## Tích hợp vào Trình soạn thảo (Editor Integration)
- Media Manager không chỉ đứng độc lập, mà phải được nhúng (Embed) dưới dạng một Modal Popup.
- Khi Editor đang viết báo, bấm nút chèn ảnh -> Mở Modal Media Manager -> Chọn ảnh đã có sẵn hoặc Tải ảnh mới lên -> Bấm "Chèn vào bài viết" -> Modal đóng, ảnh xuất hiện trong Editor.

## Công cụ Chỉnh sửa nhẹ (Lightweight Image Editor)
CMS cần hỗ trợ các thao tác cơ bản nhất ngay trên Browser (Tránh việc Editor phải tải ảnh xuống Photoshop rồi tải lên lại):
- Cắt ảnh (Crop) theo tỷ lệ chuẩn: 16:9, 4:3, 1:1.
- Xoay ảnh (Rotate).
- Lật ảnh (Flip).

## Tìm kiếm & Phân loại
- Hỗ trợ gắn Tag (Nhãn) cho Hình ảnh (Vd: "Ảnh Bão Yagi", "Ảnh Kho hàng").
- Thanh tìm kiếm cho phép tìm Ảnh theo Tên file gốc hoặc theo Tag.
