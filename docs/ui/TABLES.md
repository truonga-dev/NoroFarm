# Tables (Bảng dữ liệu)

Bảng dữ liệu là thành phần quan trọng nhất của NoroFarm, dùng để hiển thị giá nông sản số lượng lớn. Bảng cần giải quyết bài toán hiển thị đa cột trên thiết bị di động.

## 1. Cấu trúc Bảng
- **Header (`thead`):** Chữ in hoa nhỏ (`uppercase text-xs`), font trung bình (`font-medium`), màu xám (`text-muted-foreground`). Border bottom phân cách rõ.
- **Rows (`tr`):** Viền dưới mờ ranh giới (`border-b`).
- **Hover Effect:** Khi chuột lướt qua dòng, nền dòng sẽ đổi màu nhẹ (`hover:bg-muted/50`) để giúp mắt theo dõi ngang dễ dàng.

## 2. Tabular Data (Số liệu)
Bắt buộc căn lề phải (Right-align) đối với các cột chứa số liệu (Giá, Thay đổi %...) để dễ so sánh hàng đơn vị. Bắt buộc dùng font Monospace hoặc `tabular-nums`.

## 3. Hiển thị Trạng thái (Status Indicators)
- Dùng Badge hoặc Icon màu xanh lá mũi tên lên (↑) cho giá tăng.
- Dùng Icon màu đỏ mũi tên xuống (↓) cho giá giảm.
- Dùng màu xám dấu gạch (-) cho giá không đổi.

## 4. Mobile Responsive Table
Bảng HTML thuần rất khó xem trên điện thoại. Cách xử lý của NoroFarm:
1. **Scrolling ngang (Horizontal Scroll):** Bọc bảng trong một `div` có `overflow-x-auto`. Header có thể stick (`sticky left-0`) cho cột tên sản phẩm.
2. **Chuyển đổi sang List/Card View:** Trên màn hình dưới 640px (`sm`), ẩn bảng dạng lưới và render dữ liệu dưới dạng danh sách các Card nhỏ (Mỗi card là một nông sản, hiển thị giá nổi bật bên trong).
