# Figma Component Library (Thư viện Thành phần)

Mọi thành phần trong Figma của NoroFarm đều phải được "Create Component" (`Cmd + Option + K`) để có thể tái sử dụng (Instancing).

## 1. Nút bấm (Button)
**Cấu trúc Lớp (Layer Structure):**
- Text Label (Fill Container / Hug Content)
- Left Icon (Optional)
- Right Icon (Optional)

**Variants (Các biến thể):**
- **Type:** `Primary` (Nền Emerald, Chữ Trắng), `Secondary` (Nền Xám, Chữ Đen), `Outline` (Viền Xám, Nền trong suốt), `Ghost` (Không viền, Không nền).
- **Size:** `sm` (Cao 32px), `md` (Cao 40px), `lg` (Cao 48px).
- **State:** `Default`, `Hover`, `Active`, `Disabled`. (Cài đặt Component Property cho State để Prototype dễ dàng).

## 2. Thẻ hiển thị (Card)
**Variants:**
- **Padding:** `Standard` (24px), `Compact` (16px).
- **Style:** `Elevated` (Có Shadow), `Outlined` (Chỉ có Viền).

## 3. Nhập liệu (Input Field)
**Variants:**
- **State:** `Default`, `Hover`, `Focused` (Ring Xanh 2px), `Error` (Ring Đỏ 2px), `Disabled` (Nền xám mờ).
- **Icon:** `Left Icon`, `Right Icon` (Boolean Property - Tắt mở linh hoạt).

## 4. Các Components khác
- **Badge / Tag:** Property `Color` (Emerald, Rose, Amber, Slate). Dùng để hiển thị trạng thái (VD: Tin mới, Tăng giá).
- **Avatar:** Property `Size` (24, 32, 40, 48), `Type` (Image, Placeholder Initials).
- **Toggle (Switch):** State `On`, `Off`. Màu On là Xanh Emerald. Cần có Smart Animate giữa 2 state.

## 5. Tổ chức Thư mục (Figma Assets Panel)
Các Component được gom nhóm theo tên với dấu `/` để tự động tạo Folder trong Figma:
- `Inputs/Button`
- `Inputs/TextField`
- `DataDisplay/Card`
- `DataDisplay/Table`
- `Feedback/Modal`
