# Tích hợp API Thời tiết (Weather API Integration)

## Mục tiêu
Cung cấp dữ liệu dự báo thời tiết (Nhiệt độ, Độ ẩm, Lượng mưa, Cảnh báo thời tiết cực đoan) theo thời gian thực cho các vùng trồng cà phê, giúp nông dân đưa ra quyết định canh tác (Tưới tiêu, Thu hoạch).

## Nhà cung cấp đề xuất (Provider)
- **OpenWeatherMap** (Gói Professional / Enterprise nếu cần dự báo nông nghiệp chuyên sâu).
- Lựa chọn thay thế: **AccuWeather API**, **WeatherAPI.com**.

## Chiến lược Tích hợp (Integration Strategy)
1. **Cronjob Cào Dữ Liệu (Polling):**
   - Không để Frontend (Trình duyệt của Nông dân) gọi trực tiếp sang OpenWeather. Điều này sẽ làm lộ API Key và đốt sạch hạn mức (Quota) chỉ trong vài phút nếu có 10,000 người truy cập.
   - Backend FastAPI sẽ cài đặt một Worker chạy ngầm (Celery/RQ) mỗi 3 giờ một lần. Worker này sẽ lấy danh sách Tọa độ (Lat/Lon) của 5 Tỉnh Tây Nguyên, gọi API OpenWeather 5 lần.
   - Dữ liệu thu được sẽ được Chuẩn hóa (Format) và lưu vào Database / Redis.
2. **Cung cấp cho Frontend:**
   - Frontend gọi API nội bộ của NoroFarm (`GET /api/weather?region=dak_lak`).
   - Backend lấy dữ liệu đã lưu trong Redis trả về. Nhanh, miễn phí và kiểm soát được cấu trúc JSON.

## Dữ liệu Cần trích xuất (Data Mapping)
- **Hiện tại (Current):** Nhiệt độ thực tế, Cảm giác như (Feels like), Độ ẩm (Humidity), Tốc độ gió, Mô tả (Nhiều mây, Nắng gắt).
- **Dự báo 7 ngày (7-Day Forecast):** Nhiệt độ cao nhất/thấp nhất, Xác suất có mưa (POP - Probability of Precipitation). Bắt buộc phải có POP vì đây là thông số quan trọng nhất với nông dân.

## Xử lý Lỗi (Error Handling)
- Nếu API OpenWeather sập hoặc hết tiền (429 Too Many Requests), Backend giữ nguyên dữ liệu cũ trong Database để Frontend hiển thị, kèm theo dòng ghi chú "Cập nhật lần cuối: [Thời gian]". Tránh để Widget Thời tiết trắng bóc.
