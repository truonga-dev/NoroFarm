# Bảng Điều khiển Phân tích (Analytics Dashboard)

## Mục tiêu
Nơi tập trung các biểu đồ dữ liệu thời gian thực dành cho Ban Giám đốc (C-Level) và Đội ngũ Marketing theo dõi hàng ngày. 

## Vị trí Dashboard
- Không tự code Dashboard này trên trang Admin của NoroFarm vì tốn tài nguyên và không đẹp. 
- Sử dụng **Looker Studio (Google Data Studio)** kết nối trực tiếp với GA4 và Supabase PostgreSQL, hoặc dùng **PostHog Dashboards** để kéo thả các biểu đồ có sẵn.

## Cấu trúc Biểu đồ cần có (Must-have Charts)

### 1. Tổng quan Sức khỏe (Health Metrics)
- **Active Users (Real-time):** Số người đang online trên web lúc này (Thường tăng đột biến vào 7h sáng khi Sàn London mở cửa).
- **Daily Active Users (DAU):** Số người dùng truy cập trong ngày.
- **Weekly Active Users (WAU) & Monthly Active Users (MAU).**

### 2. Hành vi & Nguồn Khách (Acquisition & Behavior)
- **Traffic by Channel (Pie Chart):** Biểu đồ tròn chia tỷ lệ nguồn khách (Organic Search 60%, Direct 30%, Social 10%).
- **Top Pages (Table):** Bảng xếp hạng 10 trang được truy cập nhiều nhất hôm nay. (Giúp BTV biết tin tức nào đang Hot để viết thêm).
- **Device Category (Bar Chart):** Biểu đồ cột so sánh Mobile vs Desktop.

### 3. Hiệu năng Hệ thống (System Analytics)
- Bảng thống kê các lệnh API (FastAPI) trả về mã lỗi `500 Internal Error` hoặc `404 Not Found` nhiều nhất trong ngày.
