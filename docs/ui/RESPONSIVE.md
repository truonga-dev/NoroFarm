# Hệ thống Responsive & Breakpoints

Thiết kế NoroFarm áp dụng phương pháp **Mobile-First**. Giao diện mặc định được tối ưu cho màn hình nhỏ nhất (điện thoại), sau đó sử dụng các breakpoint để định cấu hình lại bố cục cho màn hình lớn hơn.

## 1. Các Điểm ngắt (Breakpoints)
Sử dụng chuẩn mặc định của Tailwind CSS:

- **Mặc định (Dưới 640px) - Mobile:**
  - Layout dạng cột đơn (Single column).
  - Thanh điều hướng chuyển sang Hamburger Menu hoặc Bottom Navigation.
  - Chạm (Touch) targets phải đạt tối thiểu `44x44px`.
- **`sm` (Tử 640px) - Large Mobile / Phablet:**
  - Bắt đầu mở rộng lưới.
- **`md` (Từ 768px) - Tablet:**
  - Sidebar có thể xuất hiện dạng trượt (Off-canvas).
  - Lưới card chuyển sang 2 cột.
- **`lg` (Từ 1024px) - Desktop / Laptop nhỏ:**
  - Header mở rộng hiển thị toàn bộ menu links.
  - Lưới chuyển sang 3 cột.
- **`xl` (Từ 1280px) - Desktop:**
  - Max-width của Container kích hoạt.
  - Sử dụng khoảng trắng hai bên dồi dào để tập trung mắt người dùng vào giữa màn hình.

## 2. Chiến lược Tương tác (Interaction Strategy)
- **Thiết bị cảm ứng (Touch Devices):** Không phụ thuộc vào `hover` states. Mọi hành động click phải có phản hồi ngay lập tức (như `active` scale down nhẹ).
- **Màn hình lớn (Hover-capable):** Kích hoạt các micro-interaction phức tạp (hiện nút thao tác nhanh, phóng to ảnh, xuất hiện tooltip).

## 3. Typography Responsive
Sử dụng hàm clamp() hoặc các utility classes của Tailwind để thu nhỏ tiêu đề H1, H2 trên mobile tránh việc 1 từ bị ngắt dọc làm 2 dòng.
