# Typography - NoroFarm

Hệ thống Typography của NoroFarm chú trọng vào tính hiện đại, dễ đọc và cấu trúc thông tin rõ ràng.

## 1. Phông chữ (Font Family)
- **Primary Font:** `Geist Sans` hoặc `Inter`.
- **Monospace Font:** `Geist Mono` hoặc `JetBrains Mono` (Dùng cho hiển thị số liệu, mã cố định).

## 2. Nguyên tắc chung
- **Tracking (Letter Spacing):** Tiêu đề lớn (H1, H2) sẽ có tracking âm (ví dụ: `-0.02em` đến `-0.04em`) để tạo cảm giác gắn kết, hiện đại (phong cách Apple/Vercel). Text nội dung giữ tracking mặc định.
- **Leading (Line Height):** Tiêu đề dùng line-height khít (`1.1` hoặc `1.2`). Nội dung dùng line-height thoáng (`1.5` hoặc `1.6`).

## 3. Typographic Scale

### Headings
- **Display 1 (H1 - Hero):**
  - Kích thước: 3.75rem (60px) ở Desktop, 2.5rem (40px) ở Mobile.
  - Weight: Bold (700) hoặc ExtraBold (800).
  - Letter-spacing: `-0.04em`.
  - Line-height: `1.1`.
- **Heading 2 (H2 - Section Title):**
  - Kích thước: 2.25rem (36px) ở Desktop, 1.875rem (30px) ở Mobile.
  - Weight: SemiBold (600).
  - Letter-spacing: `-0.02em`.
  - Line-height: `1.2`.
- **Heading 3 (H3 - Card Title):**
  - Kích thước: 1.5rem (24px).
  - Weight: SemiBold (600).
  - Letter-spacing: `-0.01em`.

### Body Text
- **Body Large:**
  - Kích thước: 1.125rem (18px).
  - Weight: Regular (400) / Medium (500).
  - Line-height: `1.6`.
- **Body Base:**
  - Kích thước: 1rem (16px) - *Kích thước mặc định của toàn trang*.
  - Weight: Regular (400).
  - Line-height: `1.5`.
- **Body Small (Muted/Footnote):**
  - Kích thước: 0.875rem (14px).
  - Weight: Regular (400).
  - Line-height: `1.5`.
- **Caption / Tiny:**
  - Kích thước: 0.75rem (12px).
  - Khuyến nghị dùng in hoa (Uppercase) kèm letter-spacing `0.05em` cho các label.

## 4. Hiển thị Số liệu Giá cả (Financial Typography)
- Tất cả các con số liên quan đến giá (Ví dụ: `120,000 VND`) bắt buộc sử dụng font `font-variant-numeric: tabular-nums` để đảm bảo các chữ số canh lề thẳng nhau theo chiều dọc trong bảng.
