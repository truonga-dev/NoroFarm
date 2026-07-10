# Figma Wireframes (Bản nháp cấu trúc)

## 1. Tổng quan Wireframe
Trong Figma, Wireframe (Lo-Fi) của NoroFarm được thiết kế bằng các khối xám cơ bản (Grayscale), không có màu sắc, hình ảnh hay typo đặc biệt. Mục đích là để thống nhất Cấu trúc Thông tin (Information Architecture) trước khi lên màu.

## 2. Cấu trúc Khung cơ bản (Frame Structure)

### Frame: `WF_Desktop_Home` (1440 x 1024)
- **Top Navigation Bar:** Khối chữ nhật cao `64px`, chạy full chiều ngang. Có các ô vuông giả lập Logo, Menu Links, Search Box, và User Avatar.
- **Hero Section:** Khối lớn chiếm `1440 x 600`. Gồm 1 khối Text lớn căn giữa và 1 Nút CTA hình chữ nhật.
- **Main Dashboard Area:** Khối `1200px` căn giữa (Centered).
  - Khối Trái (800px): Coffee Prices (Chia thành bảng 4 cột giả lập).
  - Khối Phải (360px): Weather (Khối chữ nhật dọc).
  - Margin giữa 2 khối: `40px`.
- **Footer:** Khối dưới cùng cao `300px`, chia 4 cột nhỏ.

### Frame: `WF_Mobile_Home` (390 x 844)
- **Top Bar:** `390 x 56`. Gồm Logo (Trái) và Hamburger Menu (Phải).
- **Hero Section:** Nội dung dồn lại thành một cột dọc. Text căn giữa, chiếm 100% chiều rộng trừ đi Margin `16px` mỗi bên.
- **Main Dashboard Area:** Toàn bộ xếp chồng dọc (Stack). Khối Giá Cà phê nằm trên, Khối Thời tiết nằm dưới. Gap `16px`.
- **Bottom Navigation Bar:** Khối dính (Sticky Bottom) cao `64px`, chia làm 4 icon đều nhau.

## 3. Quy ước Ký hiệu (Annotation)
- Hình chữ nhật có gạch chéo chữ X: Đại diện cho Hình ảnh / Bản đồ.
- Các đường thẳng song song: Đại diện cho Dữ liệu văn bản (Text).
- Hình chữ nhật bo góc mạnh (Pill shape): Đại diện cho Nút bấm (Button/Badge).
- Icon mũi tên: Thể hiện User Flow (Luồng click chuột) chuyển sang Frame khác.
