# NoroFarm — Giai đoạn 3 (lát cắt thử nghiệm): đăng tin mua/bán

**Trạng thái:** Đã cải thiện biểu mẫu hiện có; chưa thử với người giao dịch thực.  
**Phạm vi:** Tạo một tin mua/bán và chuyển sang trạng thái chờ duyệt. Không bao gồm báo giá, đặt hàng, hợp đồng hoặc thanh toán B2B.

## Thay đổi đã thực hiện

- Trường nhập có nhãn truy cập được bằng bàn phím và tên rõ ràng; thông tin loại tin, mặt hàng, giá, lượng và khu vực được nhóm theo nhiệm vụ.
- Giá chào và số lượng phải lớn hơn 0; chuỗi văn bản được loại khoảng trắng đầu/cuối trước khi gửi. Giới hạn độ dài theo các trường tương ứng của API hiện tại.
- Bản xem trước cập nhật ngay khi nhập, cho biết những gì sẽ xuất hiện công khai sau kiểm duyệt; thông báo rõ số điện thoại sẽ hiển thị trên tin.
- Nếu không tải được danh mục mặt hàng, người đăng có thể thử lại thay vì gửi một ID rỗng. Lỗi gửi tin giữ nguyên nội dung đang nhập.
- Nút gửi chỉ nói “gửi để kiểm duyệt”, tránh gây hiểu nhầm rằng tin sẽ công khai hoặc hàng hóa đã được xác minh ngay.

## Giới hạn nghiệp vụ chưa được xác minh

Quyền `seller`/`admin` hiện áp dụng cho cả tin **cần mua** lẫn **cần bán**; người mua thông thường chưa có hành trình xin quyền rõ ràng. Số điện thoại được hiển thị công khai trên tin nhưng hệ thống chưa lưu một sự đồng ý chia sẻ riêng, có thể kiểm toán. Dữ liệu lô hàng còn thiếu các thuộc tính có thể quan trọng trong B2B như phẩm cấp, nguồn gốc, thời điểm giao, chứng từ — đây là giả thuyết, không tự thêm trường bắt buộc trước nghiên cứu. API vẫn cần kiểm tra ràng buộc tương ứng ở backend vì kiểm tra tại trình duyệt không đủ để bảo vệ dữ liệu.

## Cổng kiểm chứng tiếp theo

Quan sát ít nhất một người mua và một người bán thực tạo/đọc tin, xác định thông tin thiếu và cách họ đánh giá độ tin cậy. Chốt mặt hàng/vùng thử cùng chủ dự án. Sau đó mới thiết kế dữ liệu và API báo giá; không giả lập nút “gửi báo giá” khi chưa có nơi lưu, quyền truy cập và quy trình phản hồi.

**Kiểm tra kỹ thuật:** `tsc --noEmit` đạt sau thay đổi. Production build chưa chạy lại vì ổ C: thiếu dung lượng (`ENOSPC` ở lượt trước); chưa xác nhận luồng API end-to-end.

Tham chiếu: [Khám phá giai đoạn 1](2026-10-23-b2b-ux-discovery.md) và [cấu trúc giao diện giai đoạn 2](2026-10-23-b2b-ui-phase-2.md).
