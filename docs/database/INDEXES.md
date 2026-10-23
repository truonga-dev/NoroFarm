# Cấu trúc Index (Chỉ mục) trên Database

Để đảm bảo khả năng mở rộng tới hàng triệu bản ghi và truy vấn nhanh dưới 50ms cho các API cốt lõi, NoroFarm áp dụng chiến lược tạo Index cụ thể:

## 1. Index trên Bảng Giá (High Volume Data)
Bảng `commodity_prices` và `commodity_price_history` là nơi phình to nhanh nhất.
- `CREATE INDEX idx_commodity_prices_commodity_id ON commodity_prices(commodity_id);`
  - *Lý do:* Rất thường xuyên lấy ra danh sách giá của một nông sản cụ thể.
- `CREATE INDEX idx_commodity_prices_recorded_at ON commodity_prices(recorded_at DESC);`
  - *Lý do:* User luôn ưu tiên xem giá mới nhất (sắp xếp giảm dần theo thời gian).
- `CREATE INDEX idx_commodity_price_history_date ON commodity_price_history(date DESC);`
  - *Lý do:* Tối ưu hóa truy vấn biểu đồ theo khoảng thời gian.

## 2. Index trên Dữ Liệu Thời Tiết
- `CREATE INDEX idx_weather_current_location_id ON weather_current(location_id);`
- `CREATE INDEX idx_weather_forecast_location_date ON weather_forecast(location_id, forecast_date);`
  - *Lý do:* Lấy dự báo thời tiết 7 ngày tới theo trạm nhanh nhất có thể.

## 3. Index Hỗ Trợ Đọc Tin Tức
- `CREATE INDEX idx_news_category_id ON news(category_id);`
- `CREATE INDEX idx_news_status_published_at ON news(status, published_at DESC);`
  - *Lý do:* Fetch danh sách bài viết theo danh mục hoặc tin tức mới nhất đã xuất bản.
- `CREATE INDEX idx_news_slug ON news(slug);`
  - *Lý do:* Tìm bài viết chi tiết dựa theo URL nhanh chóng.

## 4. Index Hỗ Trợ Soft Delete
- `CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;`
- `CREATE INDEX idx_news_deleted_at ON news(deleted_at) WHERE deleted_at IS NULL;`
- `CREATE INDEX idx_commodities_deleted_at ON commodities(deleted_at) WHERE deleted_at IS NULL;`
  - *Lý do:* Việc lọc dữ liệu "chưa xóa" (`deleted_at IS NULL`) diễn ra liên tục. Sử dụng *Partial Index* giúp tiết kiệm dung lượng lưu trữ index mà hiệu quả tìm kiếm vẫn cao nhất.

## 5. Index trên Foreign Keys
PostgreSQL không tự động tạo Index trên các khóa ngoại (Foreign Keys). Nên đối với các bảng có join thường xuyên (ví dụ: `profiles`, `districts`), ta cần khai báo:
- `CREATE INDEX idx_districts_province_id ON districts(province_id);`
- `CREATE INDEX idx_profiles_user_id ON profiles(user_id);`
