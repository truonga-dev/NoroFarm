# Toast Component (Thông báo thoáng qua)

## Khi nào sử dụng
Dùng để thông báo nhanh về kết quả của một thao tác người dùng vừa thực hiện. Ví dụ: "Đã copy đường link", "Cập nhật giá thành công", "Lỗi kết nối mạng".
Đặc tính: Xuất hiện dạng trôi nổi (Float), thường ở góc màn hình, và **tự động biến mất (Tắt sau vài giây)**.

## Kích thước
- Box nhỏ gọn. Chiều ngang `max-w-[350px]` hoặc `420px`.
- Chiều cao tự động dựa theo nội dung văn bản (Nên giữ văn bản dưới 2 dòng).

## Typography
- Text rất nhỏ gọn. 
- Tiêu đề (Bắt buộc): `text-sm font-semibold`.
- Mô tả phụ (Tùy chọn): `text-sm opacity-90`.

## Radius
- `8px` (`rounded-md`).

## Shadow
- Đổ bóng khá sâu để tách khỏi nền màn hình đang bận rộn: `shadow-lg` (Elevation 3).

## Padding
- `p-4`. Khoảng cách giữa Icon và Text là `gap-3`.

## Trạng thái & Hoạt ảnh (Animation/States)
- **Hiển thị (Enter):** Trượt từ mép phải (hoặc góc dưới) màn hình vào trong (`slide-in-from-right`, `fade-in`).
- **Thoát (Exit):** Tự động tắt sau 3-5 giây (`slide-out-to-right`, `fade-out`).
- **Hover:** Khi chuột lướt vào Toast, bộ đếm thời gian (timer) tạm dừng để người dùng kịp đọc. Có thể hiện một nút [X] nhỏ để đóng thủ công.
- **Xóa (Swipe):** Trên Mobile, hỗ trợ thao tác vuốt nhanh ngang màn hình (Swipe right/left) để hất tung (xóa) Toast khỏi màn hình.

## Ánh sáng (Modes)
- **Light Mode:** Nền Trắng, viền Xám nhạt, Shadow to.
- **Dark Mode:** Nền Đen bóng (Slate-950), viền Xám tối, không shadow.

## Biến thể
Giống Alert, có biến thể Trắng (Default), Đỏ (Error/Destructive), Xanh (Success).

## Accessibility
- Không bao giờ đặt thông tin quan trọng đòi hỏi thao tác khẩn cấp vào Toast (bởi vì nó tự biến mất).
- Nếu Toast có nút Action (VD: nút "Hoàn tác/Undo"), phải đảm bảo có đủ thời gian để người thao tác chậm click vào (Hoặc không tự tắt khi có nút Undo).
- Vùng chứa Toast (Toaster wrapper) sử dụng `aria-live="polite"` (Thông báo thường) hoặc `aria-live="assertive"` (Cảnh báo lỗi khẩn).
