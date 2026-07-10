# Inputs & Forms

Hệ thống nhập liệu của NoroFarm yêu cầu sự rõ ràng, rộng rãi và thân thiện trên màn hình cảm ứng (Mobile First).

## 1. Text Field
- **Chiều cao:** Tương đương Button `default` (40px). Trên mobile form có thể mở rộng lên 48px (`h-12`).
- **Border:** Viền xám nhạt (`border-input`), nền trong suốt hoặc xám rất nhạt, bo góc `md` (8px).
- **States:**
  - **Focus:** Nổi bật với vòng ring (`focus-visible:ring-2 focus-visible:ring-primary/50`).
  - **Error:** Viền chuyển sang đỏ (`border-destructive`), ring đỏ.
  - **Disabled:** Nền xám, text mờ, cursor `not-allowed`.

## 2. Các thành phần khác
- **Select / Dropdown:** Sử dụng custom dropdown (Radix UI) thay vì native HTML select để đồng bộ UI giữa các trình duyệt. Focus có ring tương tự Text Field.
- **Checkbox / Radio:** Hình vuông/tròn tối giản, custom SVG tick.
- **Toggle (Switch):** Thiết kế dạng thanh trượt của Apple (iOS style), xanh lá khi On.

## 3. Form Layout
- **Label:** Luôn nằm phía trên Text Field (Top-aligned), font-medium, chữ nhỏ `14px` (`text-sm`).
- **Helper Text:** Nằm dưới text field, dùng màu Muted, font `12px` (`text-xs`) giải thích thêm cho trường nhập liệu.
- **Error Message:** Nằm dưới text field (thay thế Helper Text), dùng màu Đỏ, có icon dấu `!` nhỏ.
