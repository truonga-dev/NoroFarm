# Market Trend Widget (Biểu đồ Tổng hợp)

## 1. Mục đích
Biểu diễn trực quan xu hướng thị trường vĩ mô bằng một biểu đồ kích thước lớn. Có thể xem được biến động 1 tháng, 3 tháng hoặc 1 năm.

## 2. Layout & Bố cục
- Card khổng lồ chiếm toàn bộ chiều ngang Dashboard.
- Cấu trúc: 
  - **Header:** Tiêu đề và Các nút Tabs lọc thời gian (7N | 1T | 3T | 1N).
  - **Body:** Vùng vẽ biểu đồ (Chart Area) cao khoảng `350px`. Cực kỳ thoáng đãng (Nhiều Whitespace).
- Sử dụng Chart Component với thiết kế Minimalist (Ẩn trục XY, Gradient fill nhạt).

## 3. Grid & Responsive
- **Desktop (12 cột):** Trải dài full màn hình.
- **Tablet (12 cột):** Giữ nguyên form ngang.
- **Mobile:** 
  - Chiều cao đồ thị giảm còn `250px` để không chiếm hết màn hình điện thoại.
  - Cắt bớt số lượng mốc thời gian (Ticks) trên trục ngang để không bị rối mắt.

## 4. Animation & Trạng thái
- **Animation:** 
  - Vẽ đồ thị: Đường line chạy từ trái sang phải mượt mà khi đổi Tab.
  - Tooltip: Gióng dọc theo tọa độ ngón tay (Touch) hoặc chuột.
- **Loading / Skeleton:** Khung vuông nhấp nháy che toàn bộ khu vực vẽ, đường biểu đồ zíc zắc giả.
- **Error:** "Lỗi khi lấy dữ liệu lịch sử." kèm icon Tải lại tròn.
- **Empty:** Icon biểu đồ trống, "Chưa có đủ dữ liệu lịch sử để vẽ biểu đồ."
