# Icon Guidelines (Quy chuẩn Biểu tượng)

Biểu tượng (Icon) giúp định hướng người dùng không cần văn bản và trang trí giao diện mà không làm nặng trang. NoroFarm sử dụng thư viện **Lucide React**.

## 1. Visual Style (Phong cách)
- **Line Art:** Icon chỉ gồm các đường nét (Stroke), không tô kín (Fill), trừ một số icon báo hiệu đặc biệt.
- **Stroke Width:** 
  - Giao diện Desktop: Cố định nét `1.5px` (Thanh mảnh, tinh tế, giống Apple SF Symbols).
  - Giao diện Mobile: Có thể tăng lên `2px` nếu icon hiển thị quá nhỏ.
- **Góc cạnh:** Lucide sử dụng bo tròn tại các góc (Round cap, Round join), hoàn toàn khớp với Border Radius của NoroFarm.

## 2. Tỉ lệ và Khung (Sizing & Bounding Box)
- **Chuẩn:** `16x16px`, `20x20px`, `24x24px`.
- Không bóp méo khung (Box) của icon.
- Luôn giữ khoảng cách quang học (Optical balance) cân đối với văn bản đi kèm.

## 3. Màu sắc
- Kế thừa màu của Text đi kèm (CSS: `currentColor`).
- Chỉ đổi màu (Semantic) khi icon đóng vai trò chỉ thị trạng thái: Check mark (Xanh), X mark (Đỏ), Alert (Vàng/Cam).
