# Kiểm thử Giao diện Lập trình (API Test)

## Mục tiêu
Đảm bảo toàn bộ các điểm cuối (Endpoints) của Backend hoạt động đúng logic, phản hồi đúng mã trạng thái HTTP (200, 400, 401, 500) và trả về cấu trúc JSON đúng chuẩn đã cam kết (API Contract).

## Phương pháp & Công cụ
- **Công cụ:** `Postman` hoặc mã nguồn Python sử dụng `pytest` kết hợp `TestClient` (của FastAPI).
- API Test tập trung vào Hành vi Đầu vào / Đầu ra (Black-box testing) mà không quan tâm code bên trong viết ra sao.

## Các kịch bản Kiểm thử API (Test Scenarios)
1. **Trường hợp Hoàn hảo (Happy Path):**
   - Truyền đầu vào đúng chuẩn -> Trả về `200 OK` và dữ liệu đúng.
2. **Trường hợp Thiếu Dữ liệu (Missing Data):**
   - Không truyền Tham số Bắt buộc -> Phải bị Pydantic chặn lại và trả về `422 Unprocessable Entity`.
3. **Trường hợp Sai Kiểu Dữ liệu (Invalid Types):**
   - Tham số yêu cầu số nguyên, truyền vào chữ cái -> Phải trả về `422`.
4. **Kiểm thử Xác thực (Auth Testing):**
   - Gọi API nhạy cảm KHÔNG kèm JWT -> Trả về `401 Unauthorized`.
   - Gọi API bằng JWT đã hết hạn -> Trả về `401 Unauthorized`.
   - Gọi API bằng JWT bị sửa đổi (Invalid Signature) -> Trả về `401 Unauthorized`.
5. **Kiểm thử Phân quyền (Role Testing):**
   - Dùng JWT của User bình thường gọi API Xóa Bài Viết -> Trả về `403 Forbidden`.

## Tự động hóa
- Dùng `Postman Newman` chạy bộ Test Collection tự động trong luồng CI/CD (GitHub Actions). Nếu có bất kỳ API nào trả về sai Contract, quá trình Deploy Backend sẽ bị dừng lại ngay lập tức.
