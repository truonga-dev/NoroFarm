# Trình tạo trang (Page Builder)

## Mục tiêu
Một tính năng Nâng cao (Advanced) giúp Admin tự tay tạo ra các trang Tĩnh (Landing Page sự kiện, Trang Giới thiệu mới, Chính sách bảo mật) mà không cần lập trình viên can thiệp vào Source Code (No-code approach).

## Chức năng
- **Quản lý Trang (Pages):** Tạo URL mới (Vd: `norofarm.com/ve-chung-toi`).
- **Lắp ghép Khối (Block-based Builder):** Cung cấp các Block có sẵn (Hero, Text, Grid, Image, FAQ) để kéo thả vào Trang.
- **Tùy chỉnh Nội dung:** Điền chữ, đổi màu nền cho từng khối.

## Layout
- Giao diện phân làm 3 cột:
  - Cột Trái: Danh sách các Block (Thành phần giao diện có thể kéo vào).
  - Cột Giữa (To nhất): Khu vực Canvas, mô phỏng trực tiếp hình ảnh trang web đang được xây dựng (Live Preview).
  - Cột Phải: Bảng Thuộc tính (Properties Panel) để sửa Text, đổi Link của Block đang được click.

## UI / UX
- **UI:** Hiện đại, giống như Elementor (WordPress) hoặc Webflow.
- **UX:** Mọi thao tác kéo thả, thay chữ sẽ được phản hồi ngay lập tức trên Canvas. Hỗ trợ nút Undo/Redo. Nút "Chuyển chế độ xem" (Desktop/Tablet/Mobile) ngay trên thanh công cụ để Admin kiểm tra giao diện Responsive.

## Quyền truy cập
- `pages:manage` (Super Admin, Marketing Manager).

## Luồng xử lý
1. Admin tạo trang `/khuyen-mai`, kéo 1 khối Hero và 1 khối Text vào. Điền nội dung. Bấm Lưu.
2. Frontend đóng gói toàn bộ cấu trúc Cây giao diện (UI Tree) này thành 1 file JSON khổng lồ.
3. API gửi JSON này về Backend lưu vào Bảng `pages`. Cột `content_json`.
4. Khi người dùng truy cập `norofarm.com/khuyen-mai`, Next.js sẽ load file JSON này từ DB. Next.js chạy qua một Bộ máy phân giải (Dynamic Block Renderer), đọc JSON tới đâu sẽ in ra Component React tương ứng tới đó.

## Database liên quan
- Bảng `pages` (id, slug, title, content_json, is_published, meta_data).

## Security
- Khác với soạn thảo Tin tức (HTML), JSON Component Tree an toàn hơn vì nó không cho phép chèn mã thực thi trực tiếp, tránh rủi ro XSS tối đa. Frontend React sẽ chỉ bind Dữ liệu Text vào biến (Nên React tự động sanitize).
