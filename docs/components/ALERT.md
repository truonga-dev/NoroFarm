# Alert Component (Cảnh báo tĩnh)

## Khi nào sử dụng
Dùng để đưa ra thông báo cảnh báo hoặc thông tin quan trọng nằm **cố định** bên trong luồng (flow) của trang. Ví dụ: Cảnh báo bão trên trang Thời tiết, Nhắc nhở cập nhật hồ sơ trong Dashboard.
Lưu ý: Không tự động biến mất như Toast, không đè lên màn hình như Modal.

## Kích thước
- Hiển thị theo dạng một Box hình chữ nhật lấp đầy chiều rộng của không gian chứa nó (Width 100%).

## Typography
- **Tiêu đề (Title):** `text-sm font-medium`.
- **Nội dung (Description):** `text-sm text-muted-foreground` nằm dưới tiêu đề.
- Có thể đi kèm Icon bên trái chữ.

## Radius
- `8px` (`rounded-md`) hoặc `12px` (`rounded-lg`).

## Shadow
- Không shadow. Tạo sự nổi bật bằng Border và Background.

## Padding
- Tương đối rộng: `p-4` (Desktop & Mobile).

## Trạng thái (States)
- Tĩnh, không tương tác, ngoại trừ nếu bên trong Alert có chứa Link hoặc Button (VD: "Cập nhật ngay").
- Link/Button bên trong có trạng thái Focus, Hover bình thường.

## Biến thể Màu (Modes & Semantic Colors)
Alert sử dụng hệ thống màu Semantic kết hợp nền siêu nhạt (hoặc nền trong suốt + border đậm).
- **Default (Xám):** Nền trong suốt, viền xám nhạt, icon xám. Dành cho thông tin bổ sung.
- **Destructive (Đỏ):** Nền đỏ nhạt (Light) hoặc đỏ sẫm (Dark). Viền đỏ. Dành cho Lỗi nghiêm trọng (VD: "Máy chủ đang bảo trì").
- **Warning (Vàng):** Cảnh báo (VD: "Mạng của bạn đang chập chờn").
- **Success (Xanh):** Thông báo hoàn thành tĩnh.

## Accessibility
- Sử dụng chuẩn `role="alert"` (cho lỗi, thay đổi đột ngột) hoặc `role="status"` (cho thông báo bình thường).
- Icon đi kèm Alert không mang nghĩa trang trí, mà giúp những người mù màu (color-blind) phân biệt được cảnh báo (Icon tam giác ! thay vì chỉ tô màu Đỏ).
