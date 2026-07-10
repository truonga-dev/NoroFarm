# Micro-Interactions (Tương tác Vi mô)

Micro-interactions là những phản hồi nhỏ xíu, xảy ra trong khoảnh khắc của một thao tác. Chúng tạo nên sự "mượt mà" (Fluidity) và cảm giác Cao cấp (Premium) của sản phẩm.

## 1. Hover States (Trạng thái lướt chuột - Desktop)
- Mọi thành phần click được (Link, Button, Card) đều phải có hiệu ứng Hover.
- **Button:** Thay đổi độ sáng nền (Darken/Lighten 10%), tốc độ `duration-150`.
- **Card Bài viết:** Khi hover, thẻ hơi nổi lên (Lift effect - `translate-y-[-2px]`), bóng đổ sắc nét hơn (`shadow-md`). Hình ảnh cover bên trong thẻ thu phóng nhẹ (`scale-105`) mượt mà (`duration-500`).

## 2. Active / Tap States (Trạng thái bấm - Mobile)
- Trên Mobile không có Hover, thay vào đó là Touch/Tap.
- **Nút bấm:** Khi ngón tay chạm vào, nút bị lún xuống một chút (`scale-95` hoặc `scale-[0.98]`) để báo hiệu cảm ứng đã nhận.
- Xóa bỏ highlight mặc định màu xám xấu xí của trình duyệt webkit: `[-webkit-tap-highlight-color:transparent]`.

## 3. Skeleton Loading (Trạng thái tải dữ liệu)
- Không dùng vòng tròn quay quay (Spinner) cho những trang nội dung lớn. Thay vào đó dùng Skeleton.
- Khung xương Skeleton phải mô phỏng chính xác layout của nội dung thực tế sắp tải ra, để tránh hiện tượng màn hình bị giật (Cumulative Layout Shift).
- Hiệu ứng ánh sáng chạy qua (Shimmer) giúp người dùng cảm giác thời gian trôi nhanh hơn.

## 4. Tương tác Biểu đồ (Chart Tooltips)
- Biểu đồ giá không phải là ảnh tĩnh. 
- Khi ngón tay (Mobile) chạm vào hoặc chuột lướt qua, một thanh gióng dọc (Crosshair) xuất hiện ngay tức thì. 
- Tooltip chứa con số chi tiết phóng to (Pop-up) nhẹ nhàng. Cảm giác thao tác phải chính xác như sử dụng app chứng khoán chuyên nghiệp.
