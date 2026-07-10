# Quản lý Nhật ký Hệ thống (Log Management & App Logs)

## Mục tiêu
Dành cho Đội ngũ Kỹ thuật (DevOps/Backend Developer) theo dõi trạng thái Sức khỏe ứng dụng, phát hiện rò rỉ bộ nhớ, lỗi API và hiệu năng ngay từ bên trong CMS mà không cần phải SSH vào Server gốc.

## Chức năng
- **Real-time Log Tailing:** Tính năng "Cuộn log trực tiếp" giống như lệnh `tail -f` trên Linux. Giúp nhìn thấy mọi Request gọi vào Server theo thời gian thực.
- **Log Error 500:** Phân tách và gom nhóm riêng biệt các lỗi sập ứng dụng (Crash/Exceptions) cùng với Stack Trace chi tiết (Traceback) để lập trình viên gỡ lỗi (Debug).
- **Filter (Lọc Log):** Tìm kiếm log theo ID Người dùng, Request ID, Mức độ lỗi (INFO, WARNING, ERROR), Khoảng thời gian.

## Layout
- Giao diện dạng Cửa sổ Terminal nền đen (Hoặc Theme có thể chuyển đổi). Danh sách log tuôn xuống liên tục.

## UI / UX
- **UI:** Log được làm nổi bật (Syntax Highlighting) các thành phần JSON. Lỗi (ERROR) bôi chữ Đỏ, Cảnh báo (WARNING) chữ Vàng.
- **UX:** Có nút "Tạm dừng" (Pause) để cuộn lên đọc log cũ mà không bị dòng log mới đẩy trôi đi mất. Có tính năng "Copy to Clipboard" nguyên đoạn JSON lỗi để gửi cho đội Dev.

## Quyền truy cập
- Siêu nhạy cảm. Quyền `logs:system` (DevOps, Super Admin).

## Validation
- (Chỉ Đọc, Không có chức năng nhập liệu).

## Luồng xử lý
1. Backend (FastAPI) ghi log dạng JSON vào một File (`app.log`) hoặc bắn vào Redis Pub/Sub, Elasticsearch.
2. Admin mở màn hình Live Logs.
3. Frontend thiết lập kết nối WebSocket với Backend (`ws://.../admin/logs/stream`).
4. Backend đọc file log mới nhất và Push liên tục xuống Frontend.
5. Admin xem trực tiếp như trên Console Server.

## API liên quan
- `GET /api/v1/admin/logs/history` (Lấy log cũ, phân trang).
- `WS /api/v1/admin/logs/stream` (Stream log thời gian thực).

## Database liên quan
- Thường không lưu Log Kỹ thuật vào Database chính (PostgreSQL) vì sẽ làm chết Database bởi tốc độ Insert quá lớn. Log được lưu ra File, hoặc hệ thống chuyên dụng như Datadog, ELK (Elasticsearch). Cửa sổ Log Management này chỉ đóng vai trò Trình xem (Viewer).

## Responsive
- Giao diện Console siêu dài và rộng, KHÔNG phù hợp với Mobile. Bắt buộc xem trên Màn hình Desktop lớn (1080p trở lên) để theo dõi các dòng Stack Trace không bị gãy.

## Security
- Các thông tin PII (Personally Identifiable Information) như Mật khẩu, Số Điện Thoại đầy đủ, Token JWT bắt buộc đã được Filter thành `***` (Data Masking) TRƯỚC KHI bắn xuống luồng Websocket này. Ngay cả Kỹ thuật viên cũng không được quyền thấy Password của User.
