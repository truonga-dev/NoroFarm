# Quản lý Trang Tĩnh (Static Page)

## Mục tiêu
Cho phép tạo ra các trang thông tin đơn lẻ, ít thay đổi như: "Về chúng tôi", "Liên hệ", "Chính sách bảo mật", "Điều khoản sử dụng".

## Khác biệt so với Tin tức (News vs Page)
- Trang Tĩnh (Page) KHÔNG có yếu tố Thời gian (Ngày đăng, Ngày sửa) hiển thị ra ngoài cho độc giả xem.
- Trang Tĩnh KHÔNG thuộc về một Danh mục (Category) hay Tag nào cả.
- Trang Tĩnh KHÔNG xuất hiện trong Dòng thời gian Tin tức hay Trang chủ, mà thường được gắn cứng (Pin) vào Menu Header hoặc Menu Footer.

## Trình soạn thảo Trang (Page Editor)
Sử dụng chung UI của Trình soạn thảo Tin tức (Rich Text Editor). Tuy nhiên, cột bên phải sẽ ẩn đi các khối "Danh mục", "Tags". 

## Mẫu Template có sẵn
- Hỗ trợ chọn Giao diện (Template) cho Trang. Ví dụ: Nếu Editor chọn `Template: Contact`, Hệ thống sẽ tự động chèn sẵn một Form Liên hệ vào giữa trang mà Editor không cần phải biết code.
