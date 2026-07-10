# Quản lý Kho lưu trữ Tệp (File Storage Configuration)

## Mục tiêu
Dành cho Super Admin cấu hình chuyên sâu vào hệ thống lưu trữ tĩnh (S3 / Supabase Storage). Phân hệ này khác với Media Library (nơi BTV tải ảnh bài viết lên). File Storage cho phép thiết lập các Bucket khác nhau (Vd: Backup Bucket, Export CSV Bucket) và quy định dung lượng.

## Chức năng
- **Quản lý Bucket:** Tạo mới, Đổi tên, Đặt cấu hình Public/Private cho từng Bucket.
- **Giới hạn lưu trữ (Quotas):** Xem thống kê dung lượng đã sử dụng (Ví dụ: 10GB/50GB).
- **Dọn dẹp Tự động (Retention Policy):** Cấu hình tự động xóa các file tạm (Temporary files như File CSV xuất báo cáo) sau 7 ngày để tiết kiệm dung lượng.
- **Watermark:** Cấu hình tự động đóng dấu bản quyền (Watermark) NoroFarm lên mọi bức ảnh tải lên.

## Layout
- Giao diện dạng Bảng Liệt kê các Bucket đang có. Bấm vào một Bucket sẽ mở ra cấu hình chi tiết của Bucket đó.

## UI / UX
- **UI:** Thống kê dung lượng sử dụng biểu đồ dạng Vòng (Donut Chart) hoặc Thanh ngang (Progress Bar) có màu Xanh -> Vàng -> Đỏ khi sắp đầy.
- **UX:** Thao tác "Làm rỗng Bucket" (Empty Bucket) phải yêu cầu gõ lại tên Bucket để xác nhận, tránh xóa nhầm toàn bộ tài nguyên.

## Quyền truy cập
- `storage:manage` (Chỉ dành cho DevOps / Super Admin).

## Validation
- Tên Bucket: Chỉ được dùng chữ thường, số và gạch ngang. Không dấu cách (Convention của S3).
- Thời gian lưu trữ (Retention days): Phải là số nguyên > 0.

## Luồng xử lý (Watermarking)
Tính năng đóng dấu bản quyền tự động khi upload:
1. Admin vào cấu hình Bucket `news_images`, bật "Enable Watermark", tải lên Logo PNG.
2. Từ lúc này, mỗi khi có API Upload ảnh lên Bucket này, Backend FastAPI (hoặc Supabase Edge Function) sẽ can thiệp (Intercept) luồng xử lý.
3. Chạy thư viện xử lý ảnh (Vd: Pillow / Sharp) đắp Logo PNG vào góc phải dưới của bức ảnh gốc.
4. Đẩy file cuối cùng vào Storage.

## API liên quan
- Sử dụng trực tiếp API Quản trị Storage của Supabase (Admin API).
- Nếu tự build: `GET /api/v1/admin/storage/buckets`, `POST /api/v1/admin/storage/watermark-config`.

## Database liên quan
- Giao tiếp trực tiếp với Supabase Storage Schema thông qua Service Role.

## Responsive
- Hỗ trợ xem trên Mobile (Để check dung lượng gấp).

## Security
- Khác với Public Bucket, các Bucket chứa File Backup Database hay Thông tin khách hàng xuất Excel bắt buộc phải thiết lập **Private Bucket**. Nghĩa là File URL không thể tự mở, chỉ có thể mở qua luồng Backend cấp Signed URL có thời hạn (Vd: 60 giây).
