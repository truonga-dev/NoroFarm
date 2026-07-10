# Quản lý Lỗi (Exception Handling)

## 1. Global Exception Handler (Xử lý tập trung)
Ở FastAPI, chúng ta không dùng `try...except` bọc lồng nhau lộn xộn trong từng hàm con. Chúng ta định nghĩa các hàm bắt lỗi toàn cục (Global Handler) ở mức Ứng dụng chính.

```python
@app.exception_handler(CustomBusinessError)
async def business_error_handler(request: Request, exc: CustomBusinessError):
    return JSONResponse(
        status_code=400,
        content={"error": exc.message, "code": exc.error_code}
    )
```

## 2. Cấu trúc Response của Lỗi (Error Format)
NoroFarm định nghĩa 1 chuẩn JSON duy nhất cho mọi lỗi trả ra Client:

```json
{
  "success": false,
  "error": {
    "code": "COMMODITY_NOT_FOUND",
    "message": "Không tìm thấy mặt hàng nông sản yêu cầu",
    "details": null
  }
}
```

## 3. Các nhóm Lỗi cơ bản (Custom Exceptions)

- `DataNotFoundError` (404): Ánh xạ về lỗi không tìm thấy (Vd: Sai ID tỉnh).
- `AuthenticationError` (401): Lỗi Token hết hạn, sai Token.
- `PermissionDeniedError` (403): User không có quyền thực hiện chức năng.
- `BusinessLogicError` (400): Dữ liệu hợp lệ (Pydantic cho qua) nhưng vi phạm luật kinh doanh (Vd: Không thể xóa Nông sản đang được nhiều người ghim).
- `ExternalServiceError` (502): Gọi API OpenWeatherMap bị timeout. Trả về thông báo thân thiện cho Client thay vì ném lỗi sập Server.

## 4. Bảo vệ Stack Trace (Che giấu lỗi 500)
Trong môi trường Production, nếu có lỗi `500 Internal Server Error` (Bug chưa bắt được, Crash code), Global Handler phải chặn lại và chỉ trả về:
`{"error": {"message": "Hệ thống đang gặp sự cố, vui lòng thử lại sau"}}`.
TUYỆT ĐỐI không ném Traceback (Chỉ ra lỗi nằm ở dòng nào của File nào) ra API vì Hacker sẽ lợi dụng thông tin này để tấn công hệ thống. 
(Traceback chỉ được ghi vào File Log ẩn dưới Server).
