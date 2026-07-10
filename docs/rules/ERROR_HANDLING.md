# Tiêu chuẩn Xử lý Lỗi (Error Handling Standard)

## Mục tiêu
Dự án không được phép sập (Crash) toàn diện vì một lỗi cục bộ. Người dùng phải luôn nhận được Thông báo lỗi Thân thiện, không phải dòng chữ Code kỹ thuật.

## 1. Tiêu chuẩn Frontend
- **Error Boundaries:** Mọi cụm UI lớn (Ví dụ: Cả cụm Bảng giá, Cụm Bài báo) phải được bọc trong React `<ErrorBoundary>`. Nếu Bảng giá bị sập do API, chỉ khu vực Bảng giá hiển thị `[Đang bảo trì]`, phần Header và Tin tức vẫn phải hoạt động bình thường. (Tránh màn hình Trắng xóa - White Screen of Death).
- **Try-Catch Block:** Tuyệt đối mọi lệnh gọi API (`fetch`, `axios`) đều phải nằm trong khối `try...catch`. 
- **User Feedback:** Trong khối `catch`, không được `console.log(error)` rồi để đó. Bắt buộc phải kích hoạt một Modal hoặc Toast Notification báo cho người dùng biết (Vd: "Mất kết nối mạng, vui lòng thử lại").

## 2. Tiêu chuẩn Backend
- **Không văng Lỗi 500 bừa bãi:** Trừ khi Database sập vật lý, mọi lỗi do Khách hàng nhập liệu sai (Validation Error, Thiếu JWT) phải trả về **Lỗi HTTP Cấp 400** (400, 401, 403, 404, 422).
- **Định dạng Lỗi Chuẩn (Standardized Error Response):**
  Mọi lỗi trả về cho Frontend phải tuân thủ chuẩn JSON duy nhất:
  ```json
  {
    "success": false,
    "error_code": "PRICE_NOT_FOUND",
    "message": "Không tìm thấy giá cà phê của ngày này.",
    "details": null
  }
  ```
  Không được lúc thì trả chuỗi `String`, lúc thì trả `Dictionary` hỗn loạn.
- **Bảo mật Stacktrace:** Tuyệt đối CẤM trả về chuỗi Stacktrace dài ngoằng (Lộ dòng code, lộ mật khẩu) ra ngoài môi trường Production.
