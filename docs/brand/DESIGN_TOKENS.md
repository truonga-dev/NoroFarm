# Design Tokens (Biến số Thiết kế)

Design Tokens là cầu nối giữa ngôn ngữ thiết kế và Code (CSS/Tailwind). Tại NoroFarm, mọi thông số đều được quy hoạch thành token.

## 1. Cấu trúc Token
Các Token được sử dụng trong Tailwind CSS Config thông qua CSS Variables để dễ dàng chuyển đổi Light/Dark mode.

Ví dụ biến CSS (CSS Variables):
```css
:root {
  --background: 0 0% 100%;       /* #FFFFFF */
  --foreground: 222 47% 11%;     /* Slate-900 */
  --primary: 142 71% 45%;        /* Emerald-500 */
  --border: 214 32% 91%;         /* Slate-200 */
  --radius: 0.5rem;              /* 8px */
}

.dark {
  --background: 0 0% 4%;         /* #0A0A0A */
  --foreground: 210 40% 98%;     /* Slate-50 */
  --primary: 142 71% 45%;        
  --border: 0 0% 15%;            
}
```

## 2. Tiêu chuẩn Đặt tên (Naming Convention)
- Token không mang tên màu sắc vật lý (KHÔNG gọi là `color-green`), mà gọi theo Ngữ nghĩa (Semantic).
- Ví dụ: `bg-primary`, `text-muted-foreground`, `border-destructive`.

## 3. Tích hợp
Tất cả Design Tokens này được mã hóa trực tiếp vào file `tailwind.config.ts` của frontend, tạo thành nền tảng vô hình cho toàn bộ Components (`shadcn/ui`). Mọi thay đổi về Brand (đổi màu Primary) chỉ cần cập nhật ở file gốc này.
