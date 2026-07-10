# Kiểm thử Tải trọng (Load & Stress Test)

## Mục tiêu
Xác định giới hạn chịu đựng (Capacity) của Server Backend và Database (FastAPI + Supabase) khi có hàng ngàn Nông dân cùng truy cập một lúc (Ví dụ: Cùng đổ xô vào xem giá Cà phê lúc 8h sáng).

## Phân loại Test
1. **Load Test (Kiểm thử tải):** 
   - Đưa một lượng Traffic giả lập bằng với Mức Cao Điểm dự kiến (Ví dụ 10,000 requests/phút). 
   - Xem Server có phản hồi đúng hạn (Dưới 300ms) và không có Request nào bị rơi rớt (0% Error rate) hay không.
2. **Stress Test (Kiểm thử ép tải):**
   - Đưa lượng Traffic tăng vọt và vô hạn cho đến khi Server sập (Crash).
   - Mục đích để tìm ra Nút thắt cổ chai (Bottleneck) nằm ở đâu (CPU, RAM, Database Connections, hay Redis?). Và xem Server mất bao lâu để tự hồi phục (Auto Recovery) sau khi sập.

## Công cụ
- Sử dụng **K6** (Của Grafana) hoặc **Locust** (Python). Khuyến nghị dùng K6 vì code bằng JS và hiệu năng tạo truy vấn giả cực cao.

## Kịch bản (Scenarios)
- **API Đọc (Read-heavy):** 95% traffic của NoroFarm là đọc dữ liệu (Xem giá, Xem tin tức). Thiết lập K6 bắn hàng nghìn Request GET vào các Endpoint public. (Lưu ý phải Bật Redis Cache để kiểm tra hiệu quả của Cache).
- **API Ghi (Write-heavy):** Giả lập hàng trăm Admin cùng lúc bấm "Lưu bài viết". Kịch bản này dễ làm chết Database nhất do Lock Row (Khóa dòng) trên Postgres.

## Đánh giá Tiêu chuẩn
- Thời gian phản hồi (P95 Response Time): 95% số request phải được trả về trong vòng **Dưới 200ms**.
- Lỗi (Error Rate): **Dưới 0.1%** khi ở chế độ Load Test.
- Database Connections: Theo dõi bảng Connection Pool (PgBouncer) của Supabase không được đạt trạng thái Exhausted (Kiệt sức).
- Nếu không đạt, Backend Dev phải tiến hành tối ưu lại SQL Query (Thêm Index, Tránh N+1) hoặc tăng RAM/CPU cho Server.
