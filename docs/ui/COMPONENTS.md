# Quy chuẩn Components (UI Kit)

NoroFarm xây dựng thư viện Component dựa trên **shadcn/ui** và Radix UI để đảm bảo tính tiếp cận (Accessibility - a11y) và khả năng tùy biến cao.

## 1. Nguyên tắc Xây dựng Component
- **Atomic Design:** Xây dựng từ các yếu tố nhỏ nhất (Icon, Button, Input) lên các cấu trúc phức tạp hơn (Card, Table, Form).
- **Thừa kế (Composition):** Tránh viết các props khổng lồ cho component. Thay vào đó, sử dụng composition (truyền `children`) để lắp ghép.
- **Tách biệt Logic và UI:** Các component thuần túy chỉ nhận `props` để render. Data fetching sẽ được thực hiện ở lớp cha (Page hoặc Layout).

## 2. Accessibility (a11y)
- Mọi component tương tác (Button, Link, Input) bắt buộc có trạng thái `:focus-visible` sử dụng ring (vòng sáng bao quanh) màu Primary hoặc Ring mặc định để người dùng điều hướng bằng bàn phím có thể nhận biết.
- Sử dụng aria-attributes đầy đủ cho màn hình đọc (Screen Readers).

## 3. Trạng thái chung của Component
Bất kỳ interactive component nào cũng phải thiết kế rõ 5 trạng thái:
1. **Default (Mặc định)**
2. **Hover (Lướt chuột):** Chuyển màu nhạt/đậm hơn, hoặc đẩy shadow/transform nhẹ.
3. **Focus / Focus-visible:** Đường viền sáng (ring) nổi bật.
4. **Active (Đang nhấn):** Thường scale down (ví dụ `scale-95`) để tạo cảm giác lún xuống vật lý.
5. **Disabled (Vô hiệu hóa):** Opacity giảm còn `0.5`, trỏ chuột thành `not-allowed`, màu chuyển xám.
