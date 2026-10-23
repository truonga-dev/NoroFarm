# Database Tables Dictionary

Danh sách toàn bộ các bảng trong hệ thống NoroFarm. Hệ thống được chuẩn hóa, sử dụng Supabase PostgreSQL. Tất cả các bảng đều mặc định sử dụng `UUID` cho khóa chính và các trường thời gian `created_at`, `updated_at`.

## 1. Người Dùng và Phân Quyền (RBAC)
- **`users`**: Chứa thông tin đăng nhập cốt lõi (tích hợp được với Auth của Supabase).
- **`profiles`**: Thông tin cá nhân hóa của user (họ tên, sdt, địa chỉ). Quan hệ 1-1 với `users`.
- **`roles`**, **`permissions`**, **`user_roles`**, **`role_permissions`**: Cấu trúc phân quyền Role-based Access Control tiêu chuẩn. Cho phép gán linh hoạt nhiều quyền cho role, nhiều role cho user.

## 2. Nông Sản và Giá Cả
- **`commodity_categories`**: Phân loại nông sản (Cây công nghiệp, Cây ăn quả...).
- **`commodities`**: Thông tin chi tiết mặt hàng nông sản (Tên, đơn vị tính, mô tả).
- **`price_sources`**: Nguồn cung cấp giá (doanh nghiệp, thương lái, đại lý).
- **`commodity_prices`**: Giá cả nông sản cập nhật theo thời gian thực (Time-series data). Có lưu vết mức giá, nguồn giá và thay đổi so với lần trước.
- **`commodity_price_history`**: Dữ liệu giá được tổng hợp theo ngày (Aggregation), dùng cho việc vẽ biểu đồ hiệu suất cao thay vì query trên bảng giá realtime.

## 3. Thời Tiết
- **`weather_locations`**: Điểm thu thập dữ liệu thời tiết (map với tỉnh/huyện).
- **`weather_current`**: Thời tiết thời gian thực mới nhất tại location.
- **`weather_forecast`**: Dự báo thời tiết theo ngày trong tương lai.
- **`weather_alerts`**: Cảnh báo thời tiết cực đoan (hạn hán, ngập mặn, bão).

## 4. Tin Tức và Xu Hướng
- **`news`**, **`news_categories`**, **`news_tags`**, **`news_tag_map`**: Cấu trúc CMS tiêu chuẩn để đăng tải các bài phân tích thị trường. Có chức năng lưu nháp, xuất bản, gắn thẻ (Many-to-Many).
- **`market_trends`**, **`trend_history`**: Dự báo xu hướng giá và đánh giá độ chính xác của dự báo theo thời gian.

## 5. Danh Mục Hành Chính
- **`provinces`**, **`districts`**: Dữ liệu danh mục Tỉnh/Thành phố và Quận/Huyện của Việt Nam.

## 6. Cấu Hình và Giao Tiếp
- **`settings`**: Lưu trữ cấu hình dạng JSONB (mềm dẻo) cho toàn bộ ứng dụng.
- **`banners`**, **`announcements`**: Quản lý banner quảng cáo và thông báo hệ thống trên website.
- **`contact_messages`**, **`newsletter_subscribers`**: Nhận feedback và quản lý tập người dùng theo dõi bản tin.

## 7. Audit (Log Hệ Thống)
- **`audit_logs`**: Ghi lại mọi thao tác quan trọng (Insert/Update/Delete) để tracking truy vết.

## Chú ý (Soft Deletes)
Hệ thống triển khai *Soft Delete* ở các bảng quan trọng (users, commodities, news) thông qua cột `deleted_at`. Dữ liệu sẽ không bị xóa vật lý mà chỉ được đánh dấu là đã xóa.
