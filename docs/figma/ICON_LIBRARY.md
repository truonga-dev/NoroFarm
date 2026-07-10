# Icon Library (Thư viện Biểu tượng)

## 1. Nguồn Icon (Source)
NoroFarm sử dụng bộ Icon nổi tiếng và hiện đại là **Lucide Icons** (Thay thế cho Feather Icons cũ). 
- Plugin Figma: `Lucide Icons`.
- Phong cách: Nét vẽ (Stroke) tròn trịa, góc bo mềm (Round cap, round join), cực kỳ phù hợp với triết lý Minimalist.

## 2. Quy chuẩn Kích thước (Icon Grid)
- **Khung bao (Bounding Box):** Mọi Icon phải được đặt trong một Frame vuông tỷ lệ 1:1, thường là `24x24 px` (Chuẩn phổ biến nhất). 
- **Không gian an toàn (Safe Area):** Hình vẽ bên trong chỉ chiếm khoảng `20x20 px`, cách viền 2px.

## 3. Quy chuẩn Nét vẽ (Stroke Properties)
- **Độ dày (Stroke Width):** Luôn để mức `2px` cho Desktop (Text 16px). Nếu dùng Icon chung với Text quá to hoặc quá nhỏ, có thể điều chỉnh Stroke (1.5px hoặc 2.5px).
- **Tuyệt đối KHÔNG DÙNG Icon Solid (Đổ đặc khối):** Trừ khi đó là trạng thái "Đã nhấn" (Active state) của thanh Bottom Navigation trên Mobile. Việc dùng Outline icon giúp giao diện thanh thoát và đỡ nặng nề hơn.

## 4. Quản lý Icon dưới dạng Component
Tạo một thư mục lớn trong Figma chứa tất cả Icon, mỗi Icon là một Component.
- Tên ví dụ: `Icon/Home`, `Icon/Coffee`, `Icon/Weather`, `Icon/Search`.
- Lợi ích: Khi sử dụng Icon trong Button, ta chỉ cần sử dụng tính năng **Instance Swap** (Đổi Component) ở thanh Properties (Cột bên phải Figma) để đổi Icon nhanh chóng mà không làm hỏng cấu trúc Auto Layout của Nút.

## 5. Màu sắc Icon
- Icon KHÔNG BAO GIỜ mang mã màu cứng (Hard-coded hex code).
- Màu (Stroke Color) phải được gán vào Token `text-primary` hoặc `text-muted`.
- Khi lập trình (Export sang SVG hoặc React Component), thuộc tính `stroke` sẽ được sửa thành `currentColor` để CSS Tailwind có thể đổi màu Icon dễ dàng thông qua thẻ chứa (Parent container).
