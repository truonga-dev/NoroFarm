# Quy tắc Nghiệp vụ (Business Rules)

## Mục tiêu
Định nghĩa các logic logic "cứng" của ứng dụng, đảm bảo tính nhất quán của dữ liệu.

## Quy tắc 1: Cập nhật & Hiển thị Giá (Pricing Rules)
- **Tần suất hiển thị:** Giao diện Bảng giá thế giới phải tự động kiểm tra và chớp nháy (Flash) khi có dữ liệu mới mỗi 15 phút.
- **Ngày nghỉ:** Sàn giao dịch thế giới đóng cửa vào Thứ 7, Chủ Nhật và Ngày Lễ quốc tế. Trong thời gian này, UI Bảng giá phải hiển thị Badge `[Đóng cửa]` và giữ nguyên mức giá cuối cùng của ngày Thứ 6.
- **Tỷ giá:** Khi chuyển đổi từ USD sang VND, bắt buộc phải dùng Tỷ giá bán ra của Vietcombank tại đúng thời điểm đó, làm tròn đến hàng trăm (Ví dụ: Không để 121,543đ mà làm tròn thành 121,500đ).

## Quy tắc 2: Phân quyền & Giới hạn (Access Control)
- Khách vãng lai (Guest) có thể xem MỌI tính năng giá cả và tin tức.
- Để sử dụng tính năng "Cài đặt báo thức Giá" (Price Alert), khách bắt buộc phải Đăng ký tài khoản.
- Tài khoản Đại lý (Agency) sau khi tạo, bị khóa chức năng tự nhập giá thu mua cho đến khi được Admin gọi điện xác minh danh tính và mở khóa (KYC).

## Quy tắc 3: Xử lý Ngoại lệ (Graceful Degradation)
- Nếu API Thời tiết (OpenWeather) bị sập, thay vì hiển thị màn hình Lỗi đỏ quạch, ứng dụng sẽ Ẩn đi Widget Thời tiết 1 cách êm ái, các phần khác vẫn hoạt động bình thường.
- Nếu Mạng của người dùng chậm (Mất mạng lúc đi vô rẫy), ứng dụng sẽ tự động tải lại Bảng giá cuối cùng đã lưu trong Cache (Offline PWA mode), kèm thông báo nhỏ `Đang ngoại tuyến. Dữ liệu lúc 08:30`.
