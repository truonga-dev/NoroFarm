# Light Mode Specification

NoroFarm Light Mode mang lại cảm giác thanh lịch, sạch sẽ và chuyên nghiệp.

## 1. Nền (Backgrounds)
- **Body Background:** Sử dụng pure white `#FFFFFF` làm lớp nền chính.
- **Surface Background:** Các thẻ Card, Sidebar, Component nhô lên sử dụng `#F9FAFB` (Gray-50) để tạo sự phân cách nhẹ nhàng mà không cần dùng border quá đậm.

## 2. Shadow (Đổ bóng)
Shadow trong Light Mode có độ tương phản và khuếch tán cao hơn để mô phỏng ánh sáng vật lý.
- **Shadow-sm:** Đổ bóng nhẹ, sắc nét ngay dưới thẻ card. Bóng mờ xám nhạt (`rgba(0,0,0, 0.05)`).
- **Shadow-lg/xl:** Dùng cho Dropdown và Modal. Độ khuếch tán lớn.

## 3. Glassmorphism (Kính mờ)
- Thanh Navigation (Header) sử dụng hiệu ứng nền trong suốt một phần kết hợp với `backdrop-blur-md` để nội dung cuộn qua tạo cảm giác 3D mượt mà (Apple style).

## 4. Đường viền (Borders)
- Giữ đường viền ở mức độ tàng hình nhất có thể (`border-gray-200` / `#E5E7EB`). Chỉ dùng khi cần phân định ranh giới rõ ràng.
