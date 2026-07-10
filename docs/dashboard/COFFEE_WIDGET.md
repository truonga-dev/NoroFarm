# Coffee Widget (Bảng Giá Cà Phê)

## 1. Mục đích
Widget quan trọng nhất trên Dashboard. Hiển thị giá cà phê Real-time của các tỉnh Tây Nguyên (hoặc mặt hàng người dùng đã ghim).

## 2. Layout & Bố cục
- Hiển thị dưới dạng Card, bên trong chia thành Grid.
- **Tiêu đề Widget:** Nằm góc trái trên. Góc phải trên có nút "Chi tiết" hoặc "Làm mới" (Refresh).
- **Phần thân:** Mỗi khu vực (Tỉnh) là một ô (Cell) hoặc một hàng ngang.

## 3. Grid & Responsive
- **Desktop (Chiếm 8 cột):** Chia làm 4 ô ngang nhỏ (`grid-cols-4`). Mỗi ô chứa tên Tỉnh, Giá, Biến động (+/-).
- **Tablet (Chiếm 12 cột - Full):** Chia làm 2 cột (`grid-cols-2`).
- **Mobile (Stack dọc):** Danh sách dọc `flex-col`, mỗi Tỉnh là một dòng, có thanh phân cách ngang (Divider) cực mờ.

## 4. Animation & Trạng thái
- **Animation:** 
  - Khi có cập nhật giá mới qua WebSocket: Con số nhấp nháy xanh (nếu tăng) hoặc đỏ (nếu giảm) trong `500ms`, sau đó trở về màu bình thường.
  - Text chuyển động mượt mà (Flip number) không bị giật cục.
- **Loading / Skeleton:** 4 khối hình chữ nhật lớn (Skeleton) thay thế cho 4 mức giá.
- **Error:** Hiện Icon Disconnect. "Mất kết nối máy chủ giá. Đang thử lại..." kèm nút "Tải lại".
- **Empty:** "Bạn chưa ghim khu vực nào. [Thêm khu vực]".
