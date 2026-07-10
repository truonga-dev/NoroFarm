# Tables Dictionary (Từ điển các Bảng)

## 1. Bảng `profiles` (Hồ sơ người dùng)
Mở rộng từ bảng `auth.users` của Supabase. Cứ mỗi lần một User đăng ký ở `auth.users`, một Trigger tự động tạo 1 dòng tương ứng bên `profiles`.
- `id` (UUID, Primary Key): Liên kết 1-1 với `auth.users.id`.
- `full_name` (Text, Nullable).
- `phone_number` (Text, Unique, Indexed).
- `avatar_url` (Text, Nullable).
- `updated_at` (Timestamp with time zone).

## 2. Bảng `commodities` (Danh mục Hàng hóa)
Lưu trữ danh sách nông sản (Cà phê, Hồ tiêu).
- `id` (Text, Primary Key): Ví dụ: `coffee_robusta`.
- `name` (Text, Not Null): Tên hiển thị.
- `unit` (Text, Not Null): Đơn vị tính (VD: `VNĐ/kg`).
- `is_active` (Boolean, Default `true`).

## 3. Bảng `regions` (Khu vực / Tỉnh thành)
Lưu trữ các vùng nguyên liệu.
- `id` (Text, Primary Key): Ví dụ: `dak_lak`.
- `name` (Text, Not Null).
- `parent_id` (Text, Nullable, Foreign Key -> `regions.id`): Để chia cấp Huyện thuộc Tỉnh.
- `lat`, `lon` (Numeric): Tọa độ phục vụ bản đồ và thời tiết.

## 4. Bảng `prices` (Lịch sử Giá cả)
Bảng có lượng dữ liệu phình to nhanh nhất.
- `id` (UUID, Primary Key).
- `commodity_id` (Text, Foreign Key -> `commodities.id`, Not Null).
- `region_id` (Text, Foreign Key -> `regions.id`, Not Null).
- `price` (Numeric, Not Null).
- `valid_from` (Timestamp, Not Null): Thời điểm chốt giá.
- Tự động tạo Partition (Phân mảnh) theo Tháng hoặc Năm khi dữ liệu vượt 10 triệu dòng.

## 5. Bảng `news` (Tin tức)
- `id` (UUID, Primary Key).
- `title` (Text, Not Null).
- `slug` (Text, Unique, Not Null): Phục vụ SEO URL.
- `content` (Text): Nội dung (Lưu dưới dạng Markdown hoặc HTML).
- `thumbnail_url` (Text).
- `published_at` (Timestamp).

## 6. Bảng `user_favorites` (Sở thích cá nhân)
Người dùng "ghim" Tỉnh thành hoặc Nông sản lên màn hình Dashboard.
- `id` (UUID, Primary Key).
- `user_id` (UUID, Foreign Key -> `profiles.id`).
- `entity_type` (Text): Loại đối tượng (`COMMODITY` hoặc `REGION`).
- `entity_id` (Text).
