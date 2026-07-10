# Tiêu chuẩn Ghi log (Logging Standard)

## Mục tiêu
Log là đôi mắt của Lập trình viên trên môi trường Sản xuất (Production). Ghi log đúng giúp việc tìm ra nguyên nhân Bug chỉ mất 5 phút thay vì 5 tiếng.

## 1. Ghi Log trên Frontend
- **Môi trường Development:** Cứ thoải mái `console.log()` để Debug.
- **Môi trường Production:** Tuyệt đối CẤM để lọt `console.log()` ra ngoài. Người dùng F12 lên xem sẽ thấy toàn bộ quá trình xử lý ngầm của hệ thống, vô cùng nghiệp dư.
- Next.js phải cấu hình Plugin `babel-plugin-transform-remove-console` để tự động xóa sạch toàn bộ lệnh in log khi Build Code.
- Thay vì in ra Console, các lỗi nghiêm trọng (Lỗi nạp bảng giá) phải được đẩy thẳng về hệ thống phân tích sự cố (Ví dụ: **Sentry**).

## 2. Ghi Log trên Backend (FastAPI)
- **Sử dụng Thư viện Chuẩn:** Không dùng lệnh `print()` để ghi Log. Bắt buộc dùng thư viện `logging` của Python hoặc các giải pháp mạnh hơn như `Loguru`. Lệnh `print()` sẽ biến mất khi Server chạy ngầm.
- **Phân cấp Log (Log Levels):**
  - `DEBUG`: Dùng để in ra kết quả trung gian khi đang test. (Tắt trên Production).
  - `INFO`: Dùng để ghi nhận một thao tác bình thường (Vd: `[INFO] User 123 vừa đăng nhập thành công`).
  - `WARNING`: Hệ thống vẫn chạy được nhưng có dấu hiệu bất thường (Vd: `[WARNING] API Thời tiết phản hồi chậm trên 3s`).
  - `ERROR`: Lỗi làm đứt gãy luồng xử lý (Vd: `[ERROR] Không thể kết nối Database`). Phải bắn Còi báo động (Alert) qua Telegram cho Dev.
- **Định dạng Log (Format):**
  Nên log ở dạng JSON (JSON Logging) để máy chủ phân tích Log (ELK Stack, Datadog, Axiom) dễ dàng lọc và tìm kiếm.
  Vd: `{"timestamp": "2026-07-10T08:00:00", "level": "ERROR", "module": "auth", "message": "Invalid JWT"}`.
