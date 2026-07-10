# Tiêu chuẩn Viết mã (Coding Standard)

## 1. Nguyên tắc cốt lõi
- **Toàn bộ Async:** Tất cả hàm I/O (Database, File, Network) BẮT BUỘC dùng `async def` và `await`. Tuyệt đối không dùng thư viện đồng bộ (như `requests`) sẽ làm treo Event Loop của FastAPI. Sử dụng `httpx` thay thế.
- **Type Hinting (Khuyến nghị kiểu):** Bắt buộc 100%. Mọi hàm phải khai báo kiểu đầu vào và đầu ra. (Ví dụ: `async def get_price(id: str) -> PriceResponse:`).
- **Linting & Formatting:** 
  - Sử dụng `Ruff` làm Linter & Formatter chính (Thay thế Flake8 + Black vì tốc độ gấp 10-100 lần).
  - Sử dụng `Mypy` để kiểm tra Type Hint khắt khe.

## 2. Chuẩn mực Biến (Variables)
- Class: `PascalCase` (Vd: `PriceService`)
- Function / Variable: `snake_case` (Vd: `get_latest_price()`)
- Constant: `UPPER_SNAKE_CASE` (Vd: `CACHE_TTL_SECONDS = 300`)

## 3. Pydantic Models (Schemas)
- Luôn chia Schema thành 3 loại rõ ràng:
  - `CreateSchema`: Dùng cho Request Body khi POST.
  - `UpdateSchema`: Dùng cho Request Body khi PUT/PATCH. (Các trường đa số là Optional).
  - `ResponseSchema`: Dùng cho Dữ liệu trả về (Có thêm trường `id`, `created_at`). Bắt buộc kế thừa `ConfigDict(from_attributes=True)` nếu lấy từ ORM.

## 4. Bơm Phụ thuộc (Dependency Injection - DI)
- Không khởi tạo Service/Repository trực tiếp bằng tay bên trong Router.
- Luôn truyền thông qua `Depends()` của FastAPI.
- Ví dụ ĐÚNG:
  ```python
  @router.get("/")
  async def get_price(service: PriceService = Depends(get_price_service)):
      return await service.fetch()
  ```

## 5. Cấm Magic Numbers/Strings
- Không rải rác các số `3600`, `60`, hoặc chuỗi tĩnh trong code. Khai báo chúng ở `core/config.py` (Môi trường) hoặc đầu file (Hằng số).
