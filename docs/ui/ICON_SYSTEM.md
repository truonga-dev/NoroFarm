# Hệ thống Icon (Icon System)

NoroFarm sử dụng thư viện **Lucide React** làm bộ icon tiêu chuẩn, đảm bảo tính thẩm mỹ, hiện đại và nhất quán với bộ Design System.

## 1. Quy chuẩn Thẩm mỹ (Visual Rules)
- **Stroke Width:** Cố định ở mức `1.5px` (đối với icon lớn) hoặc `2px` (đối với icon nhỏ dưới 16px) để nét vẽ sắc sảo, thanh thoát giống phong cách Vercel.
- **Hình khối:** Dạng hình học (geometric), không bo tròn lố, không góc cạnh quá thô cứng.
- **Màu sắc:** 
  - Icon chức năng: Kế thừa màu của văn bản hiện tại (`currentColor`).
  - Icon chỉ báo trạng thái (Status): Màu semantic (Xanh cho tăng giá/thành công, Đỏ cho giảm giá/lỗi).

## 2. Kích cỡ (Sizing Scale)
Sử dụng các class size của Tailwind để duy trì tỉ lệ:
- **Micro (12px):** `size-3` - Dùng cho metadata (ngày tháng, tác giả) hoặc footnotes.
- **Small (16px):** `size-4` - Kích thước phổ biến nhất, đi kèm với Body Text (14px - 16px). Nút bấm (Button) mặc định dùng size này.
- **Base (20px):** `size-5` - Icon trong Navigation bar, Header, hoặc tiêu đề Card.
- **Large (24px):** `size-6` - Icon chính của ứng dụng, Hero section.
- **Extra Large (32px+):** `size-8` trở lên - Icon minh họa trong Empty State.

## 3. Khoảng cách (Icon Spacing)
Khi icon đi kèm với Text (ví dụ trong Button hoặc Menu Item), khoảng cách (gap) tiêu chuẩn là `8px` (Tailwind: `gap-2`). Nếu nút quá nhỏ, dùng `4px` (`gap-1`).
