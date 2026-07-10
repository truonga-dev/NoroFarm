# Tầng Services (Logic Nghiệp vụ)

## 1. Vai trò của Service Layer
Tầng Service thực hiện điều phối luồng dữ liệu (Workflow). Router gọi Service, Service có thể gọi Cache, gọi Repository, hoặc gọi các Service khác.

## 2. Tiêu chuẩn thiết kế Service
- **Single Responsibility (Đơn nhiệm):** `PriceService` chỉ lo chuyện tính toán giá, không bao gồm logic gửi Email.
- **Xử lý Ngoại lệ (Exception Handling):** Service KHÔNG trả về HTTPException (Lỗi 404, 500 của Web). Service chỉ nên `raise` các Custom Exception thuần Python (Ví dụ: `DataNotFoundError`, `BusinessLogicError`). Tầng Router hoặc Global Exception Handler sẽ bắt lỗi này và ép kiểu về HTTP 404 tương ứng. Đảm bảo Service hoàn toàn không dính dáng đến HTTP Protocol.

## 3. Các Services chính trong NoroFarm

### `PriceService`
- Nhiệm vụ: Xử lý làm mượt dữ liệu giá, tính phần trăm tăng/giảm so với ngày hôm qua.
- Tương tác: Gọi `RedisService` lấy Cache -> Nếu rỗng (Miss), gọi `PriceRepository` -> Tính toán -> Lưu ngược lại Cache -> Trả về Router.

### `WeatherService`
- Nhiệm vụ: Phân tích và Format dữ liệu thời tiết thô từ bên thứ 3. Chuyển đổi đơn vị (Fahrenheit sang Celsius nếu cần). Sinh ra Cảnh báo chuỗi (Ví dụ: "Sắp có mưa rào, chú ý thu hoạch").

### `AuthService`
- Nhiệm vụ: Sinh mã JWT (Access / Refresh Token), xác thực Password. Quản lý logic phân quyền người dùng.

### `MarketTrendService`
- Nhiệm vụ: Khá nặng. Xử lý dữ liệu chuỗi thời gian. Dùng thuật toán lấy mẫu giảm (Downsampling) nếu người dùng yêu cầu đồ thị 1 năm để giảm số lượng Data Points trả về (Giảm kích thước Payload JSON).
