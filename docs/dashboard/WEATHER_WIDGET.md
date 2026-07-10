# Weather Widget (Thời Tiết Nông Nghiệp)

## 1. Mục đích
Cung cấp thông tin thời tiết địa phương có ảnh hưởng trực tiếp đến nông nghiệp (Nhiệt độ, lượng mưa, độ ẩm). Khác với app thời tiết chung chung, widget này cần ưu tiên hiển thị Lượng mưa và Cảnh báo bão.

## 2. Layout & Bố cục
- Gọn gàng bên trong 1 Card hẹp theo chiều ngang (Vertical card).
- **Nửa trên:** Thời tiết hiện tại (Nhiệt độ lớn `text-4xl`, Icon to, Trạng thái chữ).
- **Nửa dưới:** Dự báo 3 ngày tới dạng danh sách nhỏ.

## 3. Grid & Responsive
- **Desktop (Chiếm 4 cột dọc):** Nằm gọn bên phải Coffee Widget.
- **Tablet (Chiếm 12 cột):** Chuyển từ Layout dọc thành Layout ngang (Bên trái hiện tại, bên phải dự báo).
- **Mobile (Chiếm full màn):** Giữ Layout dọc nguyên bản.

## 4. Animation & Trạng thái
- **Animation:** Icon thời tiết có vi chuyển động (Micro-interaction) lặp lại liên tục: Mưa rơi, Mây bay nhẹ, Mặt trời xoay chậm (`spin-slow`).
- **Loading / Skeleton:** Khối tròn lớn (cho Icon) và các thanh ngang (cho Text nhiệt độ).
- **Error:** "Không thể định vị vị trí của bạn." kèm nút "Nhập địa điểm thủ công".
- **Empty:** Không có, vì Weather Widget luôn lấy vị trí mặc định (Ví dụ: Buôn Ma Thuột) nếu không có GPS.
