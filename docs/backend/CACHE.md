# Chiến lược Bộ đệm (Caching Strategy)

## 1. Công nghệ
- **Redis:** Lưu trữ key-value in-memory tốc độ cực cao, lý tưởng cho API dữ liệu biến động liên tục nhưng cần đọc nhiều (Real-time).
- Thư viện Python: `redis.asyncio` (Bắt buộc dùng Async).

## 2. Chiến lược thiết lập Key
Cấu trúc Key phải phân cấp và dễ Invalidate (Xóa).
- Giá mới nhất: `norofarm:prices:latest:{commodity_id}:{region_id}`
- Lịch sử giá: `norofarm:market_trend:{commodity_id}:{timeframe}`
- Thời tiết: `norofarm:weather:{lat}_{lon}`
- Tin tức Feed: `norofarm:news:feed:page_{x}_cat_{y}`

## 3. Cơ chế Cache (Patterns)
### A. Cache-Aside (Dùng cho Giá cả, Tin tức)
1. Router gọi Service lấy Giá.
2. Service check Redis. Có thì trả về luôn (Latency ~ 5ms).
3. Không có (Cache Miss), Service gọi Database lấy dữ liệu (Latency ~ 100ms).
4. Lưu kết quả lấy được vào Redis với TTL (Time To Live).
5. Trả về Router.

### B. Proactive Caching (Cronjob)
Thay vì chờ User đầu tiên gọi API mới lưu Cache, hệ thống có Background Worker (Scheduler) tự động lấy Giá và Thời Tiết cứ mỗi 15 phút, sau đó đắp thẳng vào Redis.
- Lợi ích: Tốc độ lúc nào cũng ở mức 5ms, triệt tiêu khái niệm "Cache Miss" cho người dùng đầu tiên.

## 4. Time To Live (TTL) theo miền dữ liệu
- **Giá Cà Phê:** TTL = 5 phút (Hoặc xóa cache ngay lập tức nếu Admin bấm nút Cập nhật giá).
- **Thời Tiết:** TTL = 30 phút (Tiết kiệm lượng gọi API OpenWeatherMap).
- **Tin Tức Feed:** TTL = 10 phút.
- **Biểu đồ thị trường (1 năm):** TTL = 24 giờ. (Chỉ lấy điểm của các ngày hôm trước).
