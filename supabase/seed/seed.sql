-- ==============================================================================
-- NOROFARM DATABASE SEED (MOCK DATA)
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- Disable triggers temporarily if needed, but since it's an initial seed we just insert in order.

-- 1. PROVINCES & DISTRICTS
INSERT INTO provinces (id, code, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'DLK', 'Đắk Lắk'),
    ('22222222-2222-2222-2222-222222222222', 'LDG', 'Lâm Đồng'),
    ('33333333-3333-3333-3333-333333333333', 'GLA', 'Gia Lai');

INSERT INTO districts (id, province_id, code, name) VALUES
    ('11111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'BMT', 'Thành phố Buôn Ma Thuột'),
    ('11111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'CMG', 'Huyện Cư M''gar'),
    ('22222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'DLT', 'Thành phố Đà Lạt'),
    ('33333333-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'PLK', 'Thành phố Pleiku');

-- 2. COMMODITY CATEGORIES & COMMODITIES
INSERT INTO commodity_categories (id, slug, name, description) VALUES
    ('44444444-4444-4444-4444-444444444441', 'cong-nghiep', 'Cây Công Nghiệp', 'Cà phê, cao su, hồ tiêu...'),
    ('44444444-4444-4444-4444-444444444442', 'an-qua', 'Cây Ăn Quả', 'Sầu riêng, bơ, mít...');

INSERT INTO commodities (id, category_id, slug, name, unit) VALUES
    ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 'ca-phe-robusta', 'Cà phê Robusta', 'kg'),
    ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', 'sau-rieng-ri6', 'Sầu Riêng Ri6', 'kg'),
    ('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444442', 'bo-034', 'Bơ 034', 'kg'),
    ('55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444441', 'mac-ca', 'Hạt Mắc Ca', 'kg'),
    ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444441', 'cao-su', 'Mủ Cao Su', 'độ TSC'),
    ('55555555-5555-5555-5555-555555555556', '44444444-4444-4444-4444-444444444441', 'ho-tieu', 'Hồ Tiêu Đen', 'kg');

-- 3. COMMODITY PRICES
INSERT INTO commodity_prices (commodity_id, province_id, price, price_change, recorded_at) VALUES
    ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', 105000, 1500, NOW()),
    ('55555555-5555-5555-5555-555555555551', '22222222-2222-2222-2222-222222222222', 104500, 1000, NOW()),
    ('55555555-5555-5555-5555-555555555551', '33333333-3333-3333-3333-333333333333', 105200, 2000, NOW()),
    ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', 85000, -2000, NOW()),
    ('55555555-5555-5555-5555-555555555553', '22222222-2222-2222-2222-222222222222', 45000, 0, NOW()),
    ('55555555-5555-5555-5555-555555555554', '11111111-1111-1111-1111-111111111111', 120000, 5000, NOW()),
    ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 350, 10, NOW()),
    ('55555555-5555-5555-5555-555555555556', '11111111-1111-1111-1111-111111111111', 135000, 3000, NOW());

-- 4. WEATHER
INSERT INTO weather_locations (id, province_id, district_id, latitude, longitude) VALUES
    ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', '11111111-0000-0000-0000-000000000001', 12.6667, 108.0383);

INSERT INTO weather_current (location_id, temperature, humidity, wind_speed, condition, icon, measured_at) VALUES
    ('66666666-6666-6666-6666-666666666661', 26.5, 85.0, 12.5, 'Nhiều mây', 'cloud', NOW());

INSERT INTO weather_forecast (location_id, forecast_date, temp_min, temp_max, condition, icon, precipitation_prob) VALUES
    ('66666666-6666-6666-6666-666666666661', CURRENT_DATE + INTERVAL '1 day', 22, 30, 'Mưa rào', 'rain', 80),
    ('66666666-6666-6666-6666-666666666661', CURRENT_DATE + INTERVAL '2 day', 21, 31, 'Nắng nhẹ', 'sun', 10);

-- 5. NEWS
INSERT INTO news_categories (id, slug, name) VALUES
    ('77777777-7777-7777-7777-777777777771', 'thi-truong', 'Thị trường'),
    ('77777777-7777-7777-7777-777777777772', 'ky-thuat', 'Kỹ thuật Canh tác');

INSERT INTO news (category_id, slug, title, excerpt, content, status, published_at) VALUES
    ('77777777-7777-7777-7777-777777777771', 'gia-ca-phe-tang-dot-bien', 'Giá cà phê Robusta tăng đột biến đạt mốc kỷ lục', 'Thị trường cà phê đang chứng kiến sự tăng giá mạnh do lo ngại nguồn cung thiếu hụt từ Brazil và Việt Nam.', 'Nội dung chi tiết bài viết...', 'published', NOW()),
    ('77777777-7777-7777-7777-777777777772', 'ky-thuat-cham-soc-sau-rieng-mua-mua', 'Kỹ thuật chăm sóc sầu riêng mùa mưa', 'Mùa mưa là thời điểm nhạy cảm đối với cây sầu riêng, bà con cần lưu ý các bệnh nấm rễ và thối trái.', 'Nội dung chi tiết bài viết...', 'published', NOW());
