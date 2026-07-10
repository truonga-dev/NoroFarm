# Error Pages (Trang Lỗi)

Trang lỗi 404 (Không tìm thấy), 500 (Lỗi server), hoặc lỗi kết nối mạng phải có thiết kế tối giản, thân thiện, không làm người dùng hoảng sợ bằng các thông báo lỗi kỹ thuật mã hóa (trừ màn hình Admin).

## 1. Trang 404 (Not Found)
- **Layout:** Căn giữa hoàn toàn (Centered full-screen).
- **Typography:** Display Title cực lớn (VD: `404`) có thể làm mờ bớt (`opacity-10`) đằng sau nội dung chính.
- **Nội dung:** 
  - Tiêu đề: "Trang không tồn tại" hoặc "Lạc đường rồi?".
  - Mô tả: "Có vẻ như trang bạn đang tìm kiếm đã bị xóa hoặc đường dẫn không chính xác."
- **Nút bấm:** Một nút Primary to: "Trở về Trang chủ".

## 2. Trang 500 (Server Error / Maintenance)
- **Icon:** Icon cảnh báo hoặc Server (Màu Cam/Xám, không dùng Đỏ gắt).
- **Tiêu đề:** "Hệ thống đang bảo trì" hoặc "Đã có lỗi xảy ra".
- **Mô tả:** "Chúng tôi đang khắc phục sự cố. Vui lòng thử lại sau ít phút."
- **Nút bấm:** "Thử lại" (Tải lại trang).

## 3. Lỗi Lưới Dữ liệu (Data Fetch Error)
- Không chuyển hướng toàn bộ trang, mà chỉ hiện trạng thái lỗi ngay bên trong Component đang bị lỗi (VD: Ô thời tiết báo lỗi thay vì cả trang báo lỗi).
- Cấu trúc giống Card Empty State nhưng viền và icon có thể hơi ám Đỏ, kèm nút "Tải lại dữ liệu".
