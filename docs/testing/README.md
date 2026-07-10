# Hướng dẫn Kiểm thử (Testing Guidelines)

## Mục tiêu
Thiết lập các tiêu chuẩn và chiến lược Kiểm thử (Testing) toàn diện cho dự án NoroFarm. Đảm bảo mọi tính năng mới được phát triển đều hoạt động đúng thiết kế, không làm vỡ các tính năng cũ (Regression) và duy trì hiệu năng cao trước khi phát hành lên môi trường Production.

## Chiến lược Kiểm thử (Test Pyramid)
NoroFarm áp dụng mô hình Kim tự tháp Kiểm thử:
1. **Unit Test (Đáy kim tự tháp):** Số lượng nhiều nhất, chạy nhanh nhất. Kiểm tra từng hàm nhỏ trong Backend (Python) và từng Component nhỏ trong Frontend (React).
2. **Integration Test (Giữa kim tự tháp):** Kiểm tra sự kết hợp giữa các module. Ví dụ: API FastAPI gọi xuống Database Supabase có ra đúng dữ liệu không.
3. **E2E Test (Đỉnh kim tự tháp):** Số lượng ít nhất, chạy chậm nhất. Giả lập thao tác người dùng thật trên Trình duyệt (Click chuột, Điền Form) từ đầu đến cuối luồng nghiệp vụ.

## Các loại Kiểm thử Bổ sung
Ngoài Kim tự tháp, dự án yêu cầu các bài Test đặc thù:
- **API Test:** Đảm bảo các API luôn tuân thủ đúng Contract (Schema) đã thỏa thuận.
- **UI Test:** Kiểm tra giao diện trực quan (Visual Regression) trên nhiều kích thước màn hình.
- **Security & Performance Test:** Kiểm thử tải, stress test và rà quét lỗ hổng bảo mật.

## Môi trường Kiểm thử
Mọi bài test tự động (Automated Tests) phải được tích hợp vào luồng CI/CD (GitHub Actions) và BẮT BUỘC phải vượt qua (Pass 100%) mới được phép gộp (Merge) code vào nhánh `main`.

## Tổ chức Tài liệu
Thư mục `docs/testing` định nghĩa chi tiết công cụ, phương pháp và quy chuẩn viết Test cho từng loại hình kể trên.
