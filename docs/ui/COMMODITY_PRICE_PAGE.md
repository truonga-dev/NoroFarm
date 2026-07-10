# Thiết kế: Trang Giá Nông Sản (Tổng hợp)

## 1. Mục tiêu
Tạo ra một danh mục (Hub) để người dùng có thể dễ dàng theo dõi giá của nhiều mặt hàng nông sản khác nhau (Sầu riêng, Bơ, Mắc ca, Cao su...).

## 2. Bố cục (Layout)
- **Header:** Tiêu đề "Giá Nông Sản Tổng Hợp", kèm một thanh tìm kiếm lớn ở trên cùng (Search Bar).
- **Tabs / Filter Bar:** Một dãy nút nằm ngang để lọc nhanh: TẤT CẢ | CÀ PHÊ | TRÁI CÂY | CÔNG NGHIỆP | LÚA GẠO.
- **Main Content (Grid of Cards):** Hiển thị dữ liệu dưới dạng các thẻ lớn (Grid). Mỗi thẻ đại diện cho một mặt hàng nông sản.

## 3. Cấu trúc Card (Thẻ Nông Sản)
- **Khu vực trên:** Tên nông sản lớn (Sầu Riêng Ri6), Kèm một icon nhỏ mờ nhạt hoặc hình ảnh minh họa tối giản làm nền.
- **Khu vực giữa:** Giá trung bình hiện tại to, rõ (`text-3xl font-bold tabular-nums`). Kế bên là mũi tên và phần trăm thay đổi (+2%).
- **Khu vực dưới:** Biểu đồ Sparkline (Biểu đồ đường mini không có trục tọa độ) hiển thị trend 7 ngày. Phía dưới cùng có liên kết "Xem chi tiết".

## 4. Spacing
- Grid cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, khoảng cách `gap-4` hoặc `gap-6`.
- Tabs: Khoảng cách giữa các tab `gap-2`. Có thể cuộn ngang (Scrollable tabs) trên mobile.

## 5. Typography & Màu sắc
- Sử dụng màu Primary để highlight Tab đang active.
- Chữ số trên thẻ rất to, màu chữ đen/trắng tương phản cao. Mũi tên xanh/đỏ tùy xu hướng.
- Biểu đồ sparkline màu xám nhạt nếu giá đi ngang, xanh nếu trend lên, đỏ nếu trend xuống.

## 6. Animation
- Lọc danh mục: Các thẻ không biến mất đột ngột mà áp dụng hiệu ứng Layout Animation (Framer Motion `layout` prop). Các thẻ bay lượn và xếp lại vị trí một cách mượt mà.
- Hover Card: Thẻ nổi lên, biểu đồ sparkline bên trong thay đổi độ dày nét vẽ hoặc sáng lên.

## 7. Responsive
- Mobile: Thẻ hiển thị thành 2 cột nhỏ trên màn hình (nếu tối giản thông tin) hoặc 1 cột để ưu tiên độ rõ ràng. Tabs có thể vuốt ngang.
- Desktop: Tối đa 4 thẻ trên một hàng để giữ tỉ lệ chuẩn.
