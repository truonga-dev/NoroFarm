# Footer

Footer của NoroFarm mang phong cách Enterprise, hiển thị toàn bộ Sitemap (bản đồ trang) và thông tin uy tín.

## 1. Cấu trúc (Desktop)
- **Top Section (Main Footer):** Chia làm 4-5 cột (Lưới Grid).
  - Cột 1 (Logo & Intro): Logo NoroFarm to, 1 đoạn văn bản ngắn mô tả sứ mệnh, các Icon Mạng xã hội.
  - Cột 2 (Giá Nông Sản): Link tới Cà phê, Sầu riêng, Bơ...
  - Cột 3 (Công cụ): Thời tiết, Biểu đồ thị trường.
  - Cột 4 (Thông tin): Về chúng tôi, Liên hệ, Điều khoản, Bảo mật.
- **Bottom Section (Copyright):** Một thanh nhỏ hơn, căn giữa hoặc chia 2 bên (Bên trái ghi Bản quyền 2026 NoroFarm, bên phải có thể là tùy chọn Ngôn ngữ). Có đường kẻ phân cách trên (`border-t border-border`).

## 2. Màu sắc và Typography
- **Nền:** Thông thường, footer có nền khác nhẹ với thân trang (VD: Thân trang trắng tinh thì footer màu xám rất nhạt `#F9FAFB`) để phân định rõ điểm cuối của website.
- **Links:** Font size `14px` (`text-sm`), màu `text-muted-foreground`. Khi Hover: Đổi sang màu `text-foreground` (Đen/Trắng) thay vì màu sặc sỡ.

## 3. Responsive (Mobile)
- Thay vì dạng ngang 4 cột, chuyển thành 1 cột dọc (Stack). Các cột Links có thể gom thành dạng Accordion (Gập/Mở) để tiết kiệm không gian trên màn hình điện thoại.
