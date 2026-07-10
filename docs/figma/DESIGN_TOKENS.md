# Figma Design Tokens (Biến thiết kế)

Sử dụng tính năng **Local Variables** (Figma Variables) của Figma để quản lý toàn bộ Token.

## 1. Collection 1: Colors (Biến Màu Sắc)
Chia làm 2 Mode (Bảng): `Light Mode` và `Dark Mode`. Khi chuyển Frame từ Light sang Dark, Figma tự động đổi màu.

- **Primitive Colors (Màu gốc - Không gán Mode):**
  - `emerald-50` -> `emerald-900`
  - `slate-50` -> `slate-900`
  
- **Semantic Colors (Màu ngữ nghĩa - Có Mode):**
  - `bg-primary`: Light (`#FFFFFF`), Dark (`#0F172A`)
  - `bg-secondary`: Light (`#F8FAFC`), Dark (`#1E293B`)
  - `text-primary`: Light (`#0F172A`), Dark (`#F8FAFC`)
  - `text-muted`: Light (`#64748B`), Dark (`#94A3B8`)
  - `border`: Light (`#E2E8F0`), Dark (`#334155`)
  - `brand-primary`: Light (`#10B981`), Dark (`#10B981`) -> Màu thương hiệu giữ nguyên.

## 2. Collection 2: Spacing (Biến Khoảng cách)
Sử dụng các biến số nguyên (Number Variables) để dùng cho Auto Layout Gap và Padding.
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px
- `space-12` = 48px

## 3. Collection 3: Radius (Bo góc)
- `radius-sm` = 4px
- `radius-md` = 8px (Cho Button)
- `radius-lg` = 12px (Cho Card)
- `radius-xl` = 16px
- `radius-full` = 9999px (Cho Avatar, Badge)

## 4. Typography Styles (Kiểu chữ)
(Phần này không nằm trong Variables mà nằm ở Text Styles).
Định nghĩa sẵn các H1, H2, H3, Body, Caption.
- `Heading 1`: Inter, 48px, Bold, Tracking -2%.
- `Body Base`: Inter, 16px, Regular, Line Height 150%.
- `Label`: Inter, 14px, Medium.

## 5. Shadow Styles (Đổ bóng)
(Nằm ở Effect Styles).
- `Shadow-sm`: `Y: 1`, `Blur: 2`, `Opacity: 0.05`
- `Shadow-md`: `Y: 4`, `Blur: 6`, `Opacity: 0.05`
- `Shadow-lg`: `Y: 10`, `Blur: 15`, `Opacity: 0.08`
- Dark Mode KHÔNG DÙNG Shadow, dùng màu viền hoặc màu nền sáng hơn để phân chia mảng khối (Elevation).
