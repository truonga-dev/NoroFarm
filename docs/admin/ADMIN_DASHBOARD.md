# Bảng Điều khiển Quản trị (Admin Dashboard)

## Mục tiêu
Cung cấp "Bức tranh toàn cảnh" (Big Picture) về sức khỏe hệ thống và các hoạt động kinh doanh cốt lõi ngay khi Admin đăng nhập. Giúp lãnh đạo đưa ra quyết định nhanh chóng dựa trên Dữ liệu (Data-driven).

## Chức năng
- **Chỉ số tổng quan (Key Metrics):** Tổng người dùng, Lượt truy cập (Traffic), Số lượng bài viết trong tuần, Lượt gọi API.
- **Biểu đồ tăng trưởng:** Theo dõi xu hướng đăng ký người dùng mới (Dạng Line Chart).
- **Cảnh báo Hệ thống:** Danh sách các lỗi phát sinh từ Backend (500 Error) hoặc các tác vụ đồng bộ giá thất bại.
- **Truy cập nhanh (Quick Actions):** Nút tạo bài viết mới, Nút cập nhật giá cà phê khẩn cấp.

## Layout
- **Sidebar (Bên trái):** Danh sách toàn bộ các Module điều hướng (Navigation Menu) có thể thu gọn.
- **Header (Bên trên):** Thanh công cụ chứa Global Search, Thông báo, Profile Admin và Nút chuyển đổi Dark/Light mode.
- **Main Content:** Khu vực Widget xếp theo dạng Lưới Bento (Bento Grid). 
  - Hàng 1: 4 Thẻ chỉ số (Metric Cards).
  - Hàng 2: Biểu đồ (Chiếm 2/3) + Danh sách hành động mới nhất (Chiếm 1/3).

## UI / UX
- **UI:** Thiết kế theo phong cách Apple/Vercel. Các khối Card trắng nền xám nhạt (`#F8FAFC`), Bo góc `12px`, Shadow siêu nhẹ.
- **UX:** Các con số tăng/giảm có mũi tên kèm màu sắc (Xanh = Tốt, Đỏ = Xấu). Thống kê load bất đồng bộ (Skeleton hiển thị trước). Hỗ trợ khoảng chọn thời gian (Date Picker) để xem thống kê theo Hôm nay, 7 ngày, 30 ngày.

## Quyền truy cập
- Yêu cầu quyền: `dashboard:read`. (Super Admin, Manager được quyền xem).

## Validation
- Kiểm tra tính hợp lệ của Khoảng thời gian (Start Date không được lớn hơn End Date) trước khi gọi API lấy thống kê.

## Luồng xử lý
1. Trình duyệt gửi Request lấy thông tin Dashboard.
2. Backend kiểm tra Token và Quyền truy cập.
3. Backend tổng hợp dữ liệu từ nhiều Bảng (Users, Logs, News). (Có thể dùng RPC để tối ưu).
4. Dữ liệu trả về Frontend. Frontend dựng Biểu đồ bằng thư viện Chart.

## API liên quan
- `GET /api/v1/admin/dashboard/metrics` (Lấy thẻ chỉ số).
- `GET /api/v1/admin/dashboard/charts` (Lấy dữ liệu vẽ biểu đồ).
- `GET /api/v1/admin/dashboard/activities` (Lấy lịch sử hoạt động mới nhất).

## Database liên quan
- Sử dụng các lệnh COUNT/GROUP BY trên các bảng: `profiles`, `news`, `audit_logs`.
- Nên tạo một View (Materialized View) trong Database để tính toán sẵn số liệu thống kê vào cuối mỗi ngày, tránh việc quét (Scan) hàng triệu dòng làm treo DB.

## Responsive
- **Desktop:** Đầy đủ các cột lưới.
- **Tablet:** Thu gọn Sidebar thành Icon. Biểu đồ thu nhỏ chiều rộng.
- **Mobile:** Các Widget xếp chồng dọc (Stack). Ẩn bớt biểu đồ phức tạp, chỉ hiển thị số liệu.

## Security
- Chặn tuyệt đối việc gọi API Dashboard nếu không có JWT Role Admin. 
- API phải chống lại các cuộc tấn công khai thác Dữ liệu lớn (DDoS) bằng cách áp dụng Rate Limiting khắt khe.

## Logging
- Ghi nhận Audit Log: `[Tên Admin] đã truy cập Bảng điều khiển vào lúc [Thời gian]`.

## Error Handling
- Nếu một trong các API phụ (VD: API lấy biểu đồ) bị sập hoặc Timeout, chỉ hiển thị Icon Lỗi ở khu vực Biểu đồ đó (Error Boundary), các Thẻ chỉ số khác vẫn phải hiển thị bình thường. Không làm sập toàn bộ trang Dashboard.
