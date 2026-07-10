# Thư viện Media (Media Library)

## Mục tiêu
Nơi quản lý tập trung toàn bộ Hình ảnh, Video, Tài liệu (PDF) được upload lên hệ thống. Giao diện giống Google Drive, hỗ trợ tái sử dụng hình ảnh cũ cho các bài viết mới mà không cần upload lại.

## Chức năng
- **Tải lên Đa luồng (Bulk Upload):** Kéo thả nhiều file cùng lúc. Upload có thanh tiến trình (Progress bar).
- **Trình xem trước (Preview):** Bấm vào Ảnh để xem kích thước gốc, thông tin Dung lượng, Độ phân giải.
- **Copy Link:** Nút sao chép nhanh URL của Ảnh để dán vào các nơi khác (Mạng xã hội, Email).
- **Thư mục (Folders):** Hỗ trợ tạo thư mục ảo (Virtual folders) để phân loại ảnh (Ví dụ: Thư mục "Bão Yagi", Thư mục "Logo").
- **Tự động tối ưu (Auto-optimization):** Ảnh dung lượng quá lớn (5MB) tự động nén hoặc chuyển đổi sang định dạng WebP khi upload.

## Layout
- **Giao diện:** Lưới hiển thị Ảnh vuông (Image Grid) với Icon thư mục. Tương tự trải nghiệm File Explorer của Hệ điều hành.
- **Bên phải (Right Panel):** Form chi tiết file hiển thị khi click vào 1 hình. (Hiện tên file, URL, Kích cỡ, Nút Xóa).

## UI / UX
- **UI:** Ảnh thumbnail hiển thị ở chế độ Cover (Cắt vuông). Nền Caro (Checkerboard) đối với ảnh PNG trong suốt.
- **UX:** Hỗ trợ Infinite Scroll (Cuộn đến đâu tải thêm ảnh đến đó) để tránh sập trình duyệt nếu thư viện có 10,000 ảnh. Hỗ trợ Modal Chèn Ảnh (Image Picker) khi Admin đang soạn thảo bài viết.

## Quyền truy cập
- `media:read`, `media:upload`, `media:delete`.

## Validation
- File Type: Chỉ cho phép `image/jpeg`, `image/png`, `image/webp`. Chặn đứng tệp `.php`, `.sh`, `.exe` ngay từ phía Client.
- File Size: Tối đa 5MB/ảnh.

## Luồng xử lý (Upload trực tiếp lên Supabase Storage)
Để giảm tải cho Server Backend (Python), NoroFarm áp dụng kỹ thuật Upload thẳng lên Cloud (Direct Upload):
1. Client Admin chọn File. Client gửi yêu cầu lấy `Signed URL` (Hoặc dùng Supabase JS Client với JWT hiện tại) từ Backend.
2. Client upload File TRỰC TIẾP lên Supabase Storage (Bỏ qua API Python).
3. Storage trả về thành công. Client gửi một API nhỏ về Backend thông báo "Tui vừa upload xong file có tên A".
4. Backend lưu thông tin File vào bảng `media_records` để quản lý hiển thị và gán vào Thư mục ảo.

## API liên quan
- Sử dụng trực tiếp Supabase Storage API (`supabase.storage.from('news_images').upload()`).
- API Backend phụ: `GET /api/v1/admin/media` (Lấy danh sách metadata của hình).

## Database liên quan
- Bản thân Supabase Storage là một Database (S3).
- Bổ sung bảng `media_files` ở PostgreSQL nếu cần quản lý Thư mục Ảo (Tùy chọn, vì Supabase đã có khái niệm thư mục thật trên Bucket).

## Responsive
- Hỗ trợ tốt trên Mobile, Camera roll. Lưới 4 cột trên Desktop thu thành 2 cột trên Mobile.

## Security
- Supabase Storage RLS sẽ chặn mọi lệnh Upload nếu thiếu Auth JWT.
- Trách nhiệm của Storage là Quét Virus (Nếu có tính năng Cloud) và Đảm bảo file ảnh không chứa mã độc (Image Exploits).

## Error Handling
- Lỗi File quá lớn: Toast đỏ "File [Tên file] vượt quá giới hạn 5MB".
- Lỗi mạng khi upload 10 file: File nào lỗi hiện chữ X đỏ, file thành công xanh, không làm đứt mạch cả quá trình (Partial Success).
