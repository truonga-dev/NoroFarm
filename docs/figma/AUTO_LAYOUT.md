# Auto Layout (Bố cục Tự động)

Bí quyết để thiết kế NoroFarm trong Figma đạt chuẩn "Code-ready" là 100% các Frame phải dùng **Auto Layout** (Tương đương Flexbox trong CSS). TUYỆT ĐỐI KHÔNG kéo thả tự do.

## 1. Cấu hình Căn bản
- **Direction:** Ngang (Horizontal) hoặc Dọc (Vertical).
- **Spacing between items (Gap):** Dùng biến hệ thống (4, 8, 12, 16, 24, 32px).
- **Padding:** Trái/Phải/Trên/Dưới.
- **Alignment:** Căn giữa (Center), Căn trái (Left), v.v.

## 2. Các hành vi thu phóng (Resizing Behaviors)
Figma cung cấp 3 hành vi, tương đương trực tiếp với CSS:
- **Fixed:** Kích thước cố định (Không dùng trong thiết kế Responsive, trừ khi là Icon `24x24`).
- **Hug contents:** Khung bao quanh tự co giãn vừa khít với nội dung bên trong (Ví dụ: Nút bấm tự dài ra nếu chữ dài). Tương đương `width: fit-content`.
- **Fill container:** Phần tử tự phình to để chiếm hết không gian trống của khung cha (Ví dụ: Thanh Search Box tự dài ra lấp khoảng trống ở giữa Header). Tương đương `flex-grow: 1` hoặc `width: 100%`.

## 3. Ví dụ Thiết lập (Card Bảng Giá Cà Phê)
- **Toàn bộ Card:** Auto Layout Dọc (Vertical). Padding `24px`. Gap `16px`. Chiều rộng `Fill Container`.
  - **Header Row:** Auto Layout Ngang (Horizontal). Width `Fill Container`. Phân bổ `Space Between`.
    - **Title Group:** Auto Layout Ngang. Gap `8px`. (Chứa Icon và Text). Width `Hug Contents`.
    - **Action Button:** Width `Hug Contents`.
  - **Data List:** Auto Layout Dọc. Gap `0px`. Width `Fill Container`.
    - **Row Item:** Auto Layout Ngang. Padding Y `16px`. Width `Fill Container`. 
      - **Tên Tỉnh:** `Fill Container` (Để đẩy các cột số sang sát mép phải).
      - **Giá:** `Hug Contents`.
      - **Biến động:** `Hug Contents`.

Chỉ với tư duy Auto Layout + Resizing này, bản thiết kế Figma của NoroFarm sẽ tự động phản ứng chính xác khi ta thay đổi kích thước Frame mẹ (Responsive kéo tay).
