# Kiểm thử Tích hợp (Integration Test)

## Mục tiêu
Kiểm tra sự kết nối và tương tác giữa các Thành phần (Components), Dịch vụ (Services) hoặc Hệ thống (Systems) khác nhau. Khác với Unit Test (cô lập hoàn toàn), Integration Test đảm bảo các bộ phận khi ghép lại với nhau vẫn hoạt động trơn tru.

## Backend Integration
- **Mục tiêu chính:** Kiểm tra luồng dữ liệu từ FastAPI đi xuống PostgreSQL (Supabase) hoặc Redis và quay về.
- **Phương pháp:**
  - KHÔNG MOCK Database. Sử dụng một Test Database thật (Tách biệt hoàn toàn với Production/Staging DB) được tự động tạo (Spin up) bằng Docker Compose mỗi lần chạy Test.
  - Viết test gọi trực tiếp vào các Repository Functions hoặc API Endpoints nội bộ.
  - Đảm bảo dữ liệu được Insert, Update, Delete thành công trên DB thật.

## Frontend Integration
- **Mục tiêu chính:** Kiểm tra sự tương tác giữa nhiều UI Component lồng nhau, trạng thái (State) của trang (Zustand/Context), và luồng chuyển trang (Routing).
- **Phương pháp:**
  - Render toàn bộ một Trang (Page) hoặc một Khối chức năng lớn.
  - Mock các API responses (Sử dụng công cụ như MSW - Mock Service Worker) để giả lập mạng.
  - Giả lập người dùng điền Form Đăng nhập -> Bấm Submit -> Chờ Loading -> Kiểm tra màn hình chuyển hướng thành công.

## Tích hợp Hệ thống bên ngoài (Third-party)
- Các tính năng gọi API ra ngoài (Ví dụ: OpenWeather, SendGrid Email).
- Khi test trên môi trường CI, KHÔNG gọi API thật để tránh tốn tiền hoặc bị Rate Limit. Bắt buộc dùng Server giả lập (Mock Server) hoặc thư viện đánh chặn HTTP (như `responses` trong Python).
