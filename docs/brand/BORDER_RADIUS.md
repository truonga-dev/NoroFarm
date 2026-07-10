# Border Radius (Độ bo góc)

NoroFarm sử dụng đường cong (Curves) mượt mà để tạo cảm giác thân thiện, dễ gần (Accessible) kết hợp với vẻ ngoài hiện đại.

## 1. Scale
- **`rounded-sm` (4px):** Dùng cho các chi tiết nhỏ nhất như Checkbox, Tooltip, Tag siêu nhỏ.
- **`rounded-md` (8px):** Chuẩn cho các yếu tố tương tác cơ bản (Button, Input field, Select).
- **`rounded-lg` (12px):** Dùng cho các Card cỡ nhỏ, Bảng (Table wrapper).
- **`rounded-xl` (16px) / `rounded-2xl` (24px):** Dùng cho các Card lớn, Khối Bento (Bento Grid), Modal. Góc bo càng lớn, cảm giác càng thân thiện và iOS-like.
- **`rounded-full` (9999px):** Avatar, Nút tròn (Icon Button), Nút Badge trạng thái (Status indicator).

## 2. Nguyên tắc Lồng ghép (Nesting Radius)
Khi đặt một component vào trong một component khác (Ví dụ: Một tấm ảnh nằm trong một tấm Thẻ - Card):
- Bán kính bo góc của component bên trong phải **nhỏ hơn** bán kính bo góc của thẻ bên ngoài để đường cong song song và tự nhiên.
- Tính toán: `Nesting Radius = Outer Radius - Padding`.
