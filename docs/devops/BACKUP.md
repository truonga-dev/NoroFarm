# Chiến lược Sao lưu (Backup & Recovery)

Dữ liệu Giá Nông sản Lịch sử (Historical Prices) là tài sản quý giá nhất của NoroFarm. Việc mất dữ liệu là thảm họa không thể chấp nhận.

## 1. Cơ sở Dữ liệu (Supabase Database)
Supabase (Bản Pro) tự động cung cấp giải pháp Backup:
- **PITR (Point-In-Time Recovery):** Tự động sao lưu dữ liệu mọi thời điểm trong ngày. Nếu lỡ tay Xóa nhầm 1 bảng, có thể Khôi phục (Restore) Database về chính xác thời điểm `10:15:30 AM` hôm qua.
- **Daily Backups:** Tự động Snapshot mỗi ngày.

## 2. Sao lưu Ngoại vi (Off-site Backup - Tùy chọn)
Để phòng ngừa sự cố mức độ sụp đổ toàn bộ nền tảng đám mây Supabase (Cực kỳ hiếm):
- Viết 1 Cronjob (GitHub Actions chạy mỗi ngày 1 lần vào lúc 2h sáng).
- Dùng lệnh `pg_dump` kết nối tới Database.
- Dump toàn bộ Cấu trúc (Schema) và Dữ liệu (Data) ra file `.sql.gz`.
- Đẩy file nén này lên một ổ cứng độc lập khác (Ví dụ: AWS S3 hoặc Cloudflare R2).

## 3. Storage (Tệp tĩnh)
Các file Ảnh bài viết, Ảnh Avatar lưu trên Supabase Storage cũng cần được đồng bộ.
- Có thể dùng các công cụ như `rclone` để tự động Sync (Đồng bộ) toàn bộ Bucket sang một nhà cung cấp S3 khác định kỳ hàng tuần.

## 4. Kế hoạch Phục hồi (Disaster Recovery Plan)
- Mọi cấu trúc Database, Triggers, Functions đều nằm trong file Migration của Git (Không sợ mất cấu trúc DB).
- Nếu sập Supabase, chỉ mất 15 phút dựng Supabase Project mới -> Chạy Migration từ Github -> Import File `.sql.gz` Data Backup -> Đổi biến `DATABASE_URL` là hệ thống chạy lại bình thường.
