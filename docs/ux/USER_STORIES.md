# User Stories (Câu chuyện Người dùng)

Dưới dạng cấu trúc Agile User Stories để định hướng phát triển tính năng.

## 1. Nhóm Tính năng: Xem Giá
- **US01:** *Là một người nông dân, tôi muốn xem giá cà phê của tỉnh mình ngay khi vào trang chủ, để tôi không phải bấm tìm kiếm nhiều.*
  - **Tiêu chí chấp nhận (AC):** Giá hiện ra < 1s. Có Skeleton khi chưa tải xong. Font chữ phải đủ lớn để đọc ngoài trời nắng.
- **US02:** *Là một thương lái, tôi muốn nhìn thấy biểu đồ xu hướng 7 ngày, để tôi đoán được đà tăng giảm.*
  - **AC:** Biểu đồ hiển thị tốt trên Mobile. Có micro-interaction khi chạm vào biểu đồ (hiện giá chi tiết ngày đó).

## 2. Nhóm Tính năng: Tin tức
- **US03:** *Là một người đọc tin, tôi muốn giao diện đọc báo thật sạch sẽ, không có quảng cáo nhảy ra, để tôi tập trung vào nội dung.*
  - **AC:** Dark mode/Light mode hỗ trợ tốt. Có thanh tiến độ đọc (Reading progress bar) trên cùng.

## 3. Nhóm Xử lý Lỗi (Error Handling)
- **US04:** *Là một người dùng vào nhầm link, tôi muốn hệ thống thông báo lỗi một cách thân thiện và hướng dẫn tôi quay lại.*
  - **AC:** Trang 404 có thiết kế (Empty State) với minh họa (Illustration) mờ nhạt, một câu xin lỗi và Nút lớn "Về trang chủ".

## 4. Nhóm Trải nghiệm PWA (Offline)
- **US05:** *Là một người dùng thường ra rẫy mất mạng, tôi muốn ứng dụng vẫn mở được và hiển thị dữ liệu giá cũ nhất đã lưu.*
  - **AC:** Cài đặt Service Worker thành công. Lỗi rớt mạng hiện Toast xám "Bạn đang offline", không sập trang (White screen of death).
