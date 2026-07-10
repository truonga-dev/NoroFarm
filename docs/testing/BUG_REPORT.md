# Báo cáo Lỗi (Bug Report)

## Mục tiêu
Khi quá trình Test tự động hoặc QA thủ công phát hiện ra Lỗi, việc tạo một Ticket Báo Lỗi chuẩn chỉnh giúp Developer hiểu ngay vấn đề nằm ở đâu mà không tốn 2 tiếng đồng hồ chỉ để gọi điện thoại hỏi "Anh bấm nút nào mà ra lỗi này?".

## Tiêu chuẩn của một Bug Ticket (Trên JIRA / GitHub Issues)

**Tiêu đề:** Ngắn gọn, chỉ đích danh lỗi.
*(Tốt: "Nút Đăng xuất ở Footer bị tràn chữ trên màn hình Mobile 320px").*
*(Tệ: "Giao diện bị lỗi").*

**Môi trường (Environment):**
- Trình duyệt: Safari 16 (iOS).
- Thiết bị: iPhone SE.
- Môi trường: Staging.

**Các bước tái hiện (Steps to Reproduce):**
(Trình bày theo dạng danh sách 1, 2, 3 như trong TEST_CASES).

**Kết quả Thực tế (Lỗi):**
- Chữ Đăng xuất bị đè lên Icon Zalo.

**Kết quả Mong muốn:**
- Chữ Đăng xuất nằm gọn trong 1 dòng.

**Bằng chứng (Evidence - Rất Quan Trọng):**
- Bắt buộc phải đính kèm Ảnh chụp màn hình (Screenshot) bị khoanh đỏ chỗ lỗi.
- Hoặc tốt nhất là 1 Video quay màn hình (Screen record) từ lúc thao tác đến lúc sập.
- Bổ sung Log Console của Trình duyệt (Nếu có chữ đỏ) hoặc Request/Response trong Tab Network.

## Phân loại Mức độ Lỗi (Severity)
1. **Critical (Khẩn cấp - P0):** Chết toàn bộ Web, Lỗi thanh toán, Chết DB. Lập trình viên phải sửa NGAY LẬP TỨC (Kể cả nửa đêm).
2. **High (Cao - P1):** Một chức năng cốt lõi không dùng được nhưng web không sập (Ví dụ: Không xem được Giá cà phê). Sửa trong vòng 1-2 ngày.
3. **Medium (Vừa - P2):** Tính năng phụ lỗi, hoặc giao diện lệch nhẹ (Ví dụ: Nút bấm sai màu). Sửa ở đợt cập nhật (Sprint) tiếp theo.
4. **Low (Thấp - P3):** Sai lỗi chính tả nhỏ, khoảng cách chưa đẹp.
