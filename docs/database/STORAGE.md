# Storage (Lưu trữ Tệp)

Sử dụng **Supabase Storage** (Bản chất là S3-compatible object storage) để lưu trữ các tài sản (Assets) như hình ảnh bài báo, avatar người dùng.

## 1. Cấu trúc Buckets (Thùng chứa)
Hệ thống NoroFarm chia thành 2 Buckets độc lập.

### Bucket 1: `news_images`
- **Mục đích:** Chứa ảnh Cover/Thumbnail của các bài viết tin tức.
- **Khả năng truy cập (Public):** Bật (Public Bucket). Bất kỳ ai có URL đều có thể tải và xem ảnh, vì đây là tin tức công khai.
- **Bảo mật Upload:** Chỉ Backend (FastAPI - Service Role) hoặc Admin thông qua CMS mới có quyền Upload hình vào Bucket này. RLS khóa quyền Upload của User thường.

### Bucket 2: `avatars`
- **Mục đích:** Chứa ảnh đại diện của người dùng.
- **Khả năng truy cập (Public):** Bật (Public Bucket).
- **Bảo mật Upload:** 
  - Người dùng (Authenticated User) ĐƯỢC PHÉP upload ảnh lên Bucket này thông qua Client Supabase SDK.
  - **Storage RLS Policy:** User chỉ được phép upload/cập nhật/xóa file nếu tên file (hoặc thư mục) chứa `auth.uid()` của họ. Ví dụ: `avatars/{user_id}/profile.jpg`. Tránh việc user này xóa đè ảnh của user khác.

## 2. Giới hạn (Constraints & Validation)
- Supabase Storage cho phép đặt quy tắc kích thước và định dạng file ngay tại Database.
- Định dạng cho phép (MIME Types): `image/jpeg`, `image/png`, `image/webp`. Không cho tải PDF hay file thực thi (`.exe`).
- Kích thước tối đa (Max file size): `2MB` cho Avatar, `5MB` cho News Image.

## 3. Trải nghiệm & Tối ưu (Optimization)
- Khuyến nghị Backend hoặc Client chuyển đổi ảnh sang chuẩn WebP trước khi Upload để giảm 50-70% băng thông tải.
- Sử dụng Image Transformation API của Supabase (nếu có bản Pro) để tự động Resize ảnh Avatar thành `128x128` khi Frontend gọi ra thay vì load nguyên tấm ảnh 2MB.
