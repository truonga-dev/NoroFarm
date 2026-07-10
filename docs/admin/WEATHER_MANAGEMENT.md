# Quản lý Thời tiết (Weather Management)

## Mục tiêu
Kiểm soát dữ liệu và cấu hình API tích hợp thời tiết của bên thứ ba (OpenWeatherMap). Mặc dù dữ liệu thời tiết chạy hoàn toàn tự động, hệ thống vẫn cần Admin để theo dõi sức khỏe kết nối, quản lý giới hạn gọi API (Rate Limit), và đưa ra các Thông báo thủ công (Khẩn cấp về thiên tai) khi cần.

## Chức năng
- **Cấu hình API (Settings):** Nhập/Sửa OpenWeather API Key. Chọn Tần suất đồng bộ (Polling Interval).
- **Trạm Thời tiết (Weather Stations):** Quản lý danh sách các Tọa độ (Lat/Lon) tương ứng với các Vùng nguyên liệu được hệ thống tự động cào dữ liệu.
- **Cảnh báo Thủ công (Manual Alerts):** Đăng tải các cảnh báo Đỏ (Bão, Lũ, Hạn hán) ghim (pin) trực tiếp lên Widget Thời tiết của vùng bị ảnh hưởng, đè lên dữ liệu tự động.
- **Thống kê API:** Xem số lượng Requests đã gọi trong tháng, chi phí ước tính.

## Layout
- **Tab 1 - Trạm Thời Tiết:** Bảng danh sách Tỉnh/Vùng và Tọa độ tương ứng, có trạng thái (Xanh = Đang đồng bộ, Đỏ = Lỗi đồng bộ).
- **Tab 2 - Cảnh báo (Alerts):** Bảng danh sách Cảnh báo nhân tạo đã tạo.
- **Tab 3 - Hệ thống (System):** Form cấu hình API Key. Biểu đồ thống kê lượng gọi API.

## UI / UX
- **UI:** Form nhập Tọa độ có kèm theo một Mini Map. Admin có thể thả Ghim (Drop pin) trên Bản đồ để tự động điền Tọa độ, thay vì phải gõ thủ công Lat/Lon.
- **UX:** API Key luôn bị che mờ bằng dấu sao `********`. Có nút "Test Connection" để kiểm tra API Key có sống hay không mà không cần lưu.

## Quyền truy cập
- `weather:manage` (Chỉ dành cho Super Admin và Kỹ thuật viên - DevOps).

## Validation
- Tọa độ (Vĩ độ - Latitude): Từ -90 đến 90.
- Kinh độ (Longitude): Từ -180 đến 180.
- Nội dung Cảnh báo Bão: Tối đa 255 ký tự (Vì hiển thị trên Widget hẹp).

## Luồng xử lý (Test Kết nối)
1. Admin nhập API Key mới, bấm "Test Connection".
2. Frontend gọi API `/api/v1/admin/weather/test`.
3. Backend sử dụng HTTPX bắn một Ping request tới OpenWeather.
4. Trả về kết quả (Success/Failed) cho Frontend.
5. Admin bấm "Save". Backend mã hóa Key và lưu vào DB (Hoặc ghi đè biến môi trường / System Settings).
6. Tự động khởi động lại (Restart) Background Worker chuyên cào dữ liệu thời tiết.

## API liên quan
- `GET /api/v1/admin/weather/stations`
- `PUT /api/v1/admin/weather/stations/{id}`
- `POST /api/v1/admin/weather/alerts`
- `POST /api/v1/admin/weather/test_connection`

## Database liên quan
- Bảng `regions` (Bổ sung cột lat/lon).
- Bảng `weather_alerts` (Lưu các thông báo khẩn cấp do Admin tạo).
- Bảng `system_settings` (Lưu API Key - Cần mã hóa đối xứng nếu lưu ở DB).

## Responsive
- Các thông số kỹ thuật và bản đồ (Map) yêu cầu không gian rộng để thao tác chính xác, ưu tiên giao diện Desktop và Tablet ngang.

## Security
- API Key (Mật khẩu kết nối) không bao giờ được gửi trả về Frontend dạng rõ (Plaintext) khi gọi API GET Settings. Backend chỉ trả về `is_configured: true`.

## Logging
- Log toàn bộ quá trình Worker chạy nền: `Đồng bộ thời tiết 15 vùng thành công (500ms)`.

## Error Handling
- Lỗi API bên thứ 3 (OpenWeather thay đổi cấu trúc dữ liệu hoặc hết tiền): Hệ thống cảnh báo đỏ góc màn hình Admin "Đồng bộ thời tiết thất bại liên tiếp 3 lần - Kiểm tra lại API".
