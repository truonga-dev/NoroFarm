# Bảo mật API (API Security)

## Mục tiêu
Ngăn chặn các kiểu tấn công khai thác dữ liệu qua các điểm cuối (Endpoints) API. 

## Thiết kế API An toàn
- **Bắt buộc HTTPS:** Mọi API chỉ được phép nhận và trả dữ liệu qua giao thức mã hóa TLS 1.2 hoặc TLS 1.3 (HTTPS). Các yêu cầu HTTP thuần phải bị Block hoặc Redirect.
- **Xác thực Đầu vào (Input Validation):** Không tin tưởng Data từ Body hay Query. FastAPI phải sử dụng Pydantic để Validate chặt chẽ:
  - Ép kiểu dữ liệu (Vd: Nhận số nguyên thì không được truyền chữ).
  - Giới hạn độ dài chuỗi (Không cho truyền chuỗi 1 triệu ký tự làm tràn RAM).
  - Sử dụng Regex để lọc ký tự bất thường.
- **Hạn chế Phơi bày Dữ liệu (Mass Assignment / Over-posting):**
  - Backend phải kiểm soát chính xác các trường (Fields) nào được phép trả về hoặc cập nhật.
  - Không truyền thẳng nguyên khối Object từ DB về Frontend (VD: Truyền nguyên bảng User có chứa trường Password Hash). Cần dùng Pydantic `Response Model` để lọc bớt dữ liệu thừa.

## Phân trang (Pagination)
- Mọi API trả về dạng Danh sách (List) phải BẮT BUỘC có phân trang.
- Giới hạn tham số `limit` hoặc `per_page` tối đa là 100. Ngăn chặn hacker truyền `limit=100000` làm treo Database.

## Xử lý Lỗi (Error Handling)
- Ẩn toàn bộ Stack Trace (Đường dẫn file mã nguồn trên Server) đối với Môi trường Production.
- Cấu hình Global Exception Handler để biến các lỗi nội bộ thành `500 Internal Server Error` chung chung.
