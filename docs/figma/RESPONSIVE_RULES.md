# Responsive Rules & Grid (Quy tắc Thích ứng & Lưới)

## 1. Lưới Figma (Layout Grid)
Để duy trì khoảng cách chuẩn xác, NoroFarm thiết lập Layout Grid trên các Frame màn hình tổng.

### Desktop (Frame 1440px)
- **Columns:** 12
- **Margin:** 120px (Tạo khoảng trống 2 bên, nội dung chính rộng 1200px).
- **Gutter (Khoảng cách giữa các cột):** 24px

### Tablet (Frame 768px)
- **Columns:** 8
- **Margin:** 32px
- **Gutter:** 16px

### Mobile (Frame 390px - iPhone 14)
- **Columns:** 4
- **Margin:** 16px
- **Gutter:** 16px

## 2. Ràng buộc (Constraints)
Đối với các thành phần không dùng Auto Layout (Rất hạn chế):
- **Ghim Logo:** Constraints `Left` & `Top`.
- **Ghim User Avatar (Header):** Constraints `Right` & `Top`.
- **Ghim Khối nội dung:** Constraints `Left & Right` (Tương đương Width 100%).
- **Ghim Footer Bottom:** Constraints `Bottom`.

## 3. Quy tắc Xuống dòng (Wrap)
- Figma đã hỗ trợ tính năng **Wrap** trong Auto Layout.
- Trên Desktop, danh sách Thống kê (Statistics) dùng Auto Layout Ngang.
- Khi kéo Frame nhỏ lại (Tablet/Mobile), vì bật chế độ `Wrap`, các thẻ Thống kê sẽ tự động nhảy xuống dòng tiếp theo thay vì bị bóp méo hay tràn ra ngoài màn hình. Đây là tính năng mô phỏng hoàn hảo `flex-wrap` của Tailwind.

## 4. Xử lý Breakpoints trong Figma
Figma không có khái niệm Breakpoint code thực thụ (Media Queries). Thay vào đó, Designer phải thiết kế 3 Frame màn hình riêng biệt: `Home_Desktop`, `Home_Tablet`, `Home_Mobile`.
- Khi bàn giao cho lập trình viên (Developer Handoff), LTV sẽ nhìn vào 3 Frame này và tự dịch ra các class Tailwind tương ứng (`sm:`, `md:`, `lg:`).
