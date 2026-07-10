# Kiểm thử Đơn vị (Unit Test)

## Mục tiêu
Kiểm tra tính đúng đắn của từng khối mã (Code block) nhỏ nhất trong hệ thống một cách độc lập. Unit Test giúp phát hiện lỗi Logic ngay lập tức trong quá trình lập trình.

## Frontend (Next.js / React)
- **Công cụ:** Jest kết hợp với React Testing Library.
- **Đối tượng test:** Các UI Components độc lập (Button, Input, Card), các Custom Hooks, các hàm tiện ích (Utility functions) như format tiền tệ, format ngày tháng.
- **Nguyên tắc:** 
  - Mock (Giả lập) toàn bộ các API call ra bên ngoài. Không bao giờ gọi HTTP thật trong Unit Test.
  - Test hành vi người dùng (Nhập text, click nút) thay vì test cấu trúc DOM bên trong.

## Backend (FastAPI / Python)
- **Công cụ:** `pytest`.
- **Đối tượng test:** Các hàm tính toán Logic (Services), hàm xử lý Dữ liệu (Formatters), các hàm Validation nội bộ.
- **Nguyên tắc:**
  - Mock Database: Không kết nối với PostgreSQL thật. Sử dụng Mock Objects hoặc SQLite In-memory để chạy test siêu tốc.
  - Phủ mã (Code Coverage): Tối thiểu 80% cho các Logic cốt lõi (Tính toán giá, Xử lý token).

## Cấu trúc Bài Test chuẩn (AAA Pattern)
Mỗi bài Unit Test nên được chia thành 3 phần rõ ràng:
1. **Arrange (Chuẩn bị):** Khởi tạo dữ liệu giả, cấu hình Mock.
2. **Act (Hành động):** Gọi hàm cần test.
3. **Assert (Xác nhận):** Kiểm tra kết quả trả về có đúng như kỳ vọng không.
