# Header & Global Navigation

Header là thanh điều hướng trên cùng, giữ vai trò quan trọng trong việc giữ chân và điều hướng người dùng qua lại giữa các tính năng.

## 1. Cấu trúc (Desktop)
- **Chiều cao:** `64px` (h-16).
- **Định vị:** Sticky top (Luôn cố định trên đỉnh màn hình khi cuộn).
- **Nền:** Kính mờ (Glassmorphism) - Nền trắng/đen với độ trong suốt 80% kết hợp `backdrop-blur-md`. Có một đường kẻ cực mỏng ở dưới (`border-b border-border`).
- **Thành phần:**
  - *Bên trái:* Logo NoroFarm. Chữ hoặc SVG Icon.
  - *Ở giữa:* Menu Links (Giá Cà phê, Nông sản khác, Thời tiết, Tin tức). Khi hover có hiệu ứng gạch chân hoặc đổi màu text sang Primary.
  - *Bên phải:* Thanh Search thu gọn (Search bar / Icon lúp), nút Dark mode toggle, Nút Đăng nhập/Liên hệ.

## 2. Cấu trúc (Mobile)
- Chỉ giữ lại Logo (Bên trái) và Hamburger Icon (Bên phải). Nút Search Icon nằm kề Hamburger.
- Khi bấm Hamburger Menu: Không xổ ra một menu nhỏ xấu xí, mà mở ra một **Full-screen Overlay** hoặc một **Drawer (Trượt từ phải sang)** (như thiết kế của Vercel/Apple). Bên trong là các link to, rõ ràng, dễ bấm bằng ngón tay.

## 3. UX Khi Cuộn (Scroll Behavior)
- Khi đang ở đầu trang (Top), Header trong suốt hoàn toàn, không có border dưới.
- Khi người dùng cuộn xuống khỏi điểm `offset 10px`, Header bắt đầu xuất hiện background blur và border dưới (áp dụng CSS transition mượt).
