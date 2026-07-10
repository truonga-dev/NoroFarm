# Hệ thống Màu sắc (Color System) - NoroFarm

Hệ thống màu được thiết kế để hỗ trợ hoàn hảo cả Light Mode và Dark Mode, thông qua việc sử dụng CSS Variables (CSS Custom Properties).

## 1. Brand Colors (Màu Thương hiệu)
Màu xanh ngọc bích/xanh lá cây (Emerald/Green) đặc trưng cho nông nghiệp nhưng được tinh chỉnh để trông "Tech" và "Premium".

- **Primary:** `hsl(142, 71%, 45%)` - Sử dụng cho các nút CTA chính, active states, và logo highlights.
- **Primary Foreground:** `hsl(0, 0%, 100%)` - Text màu trắng trên nền Primary.

## 2. Nền tảng (Background & Surface)
Lấy cảm hứng từ Vercel và Linear, nền không chỉ là màu đơn sắc mà có độ sâu.

### Light Mode
- **Background:** `hsl(0, 0%, 100%)` (True White) - Nền chính của trang.
- **Surface (Muted/Secondary):** `hsl(210, 40%, 98%)` (Off-white/Gray-50) - Nền của card, sidebar.
- **Border/Line:** `hsl(214, 32%, 91%)` (Gray-200).

### Dark Mode
- **Background:** `hsl(0, 0%, 4%)` (Deep Black) - Nền chính.
- **Surface:** `hsl(0, 0%, 9%)` (Dark Gray) - Nền của card. Tương tự thiết kế của Linear.
- **Border/Line:** `hsl(0, 0%, 15%)`.

## 3. Văn bản (Typography Colors)
### Light Mode
- **Text Primary:** `hsl(222, 47%, 11%)` (Slate-900) - Độ tương phản tối đa.
- **Text Secondary/Muted:** `hsl(215, 16%, 47%)` (Slate-500) - Phụ đề, mô tả.

### Dark Mode
- **Text Primary:** `hsl(0, 0%, 98%)` (Gần trắng) - Không dùng pure white để tránh chói mắt.
- **Text Secondary/Muted:** `hsl(215, 20%, 65%)` (Slate-400).

## 4. Màu Ngữ nghĩa (Semantic Colors)
Dùng cho cảnh báo, trạng thái giá cả (tăng/giảm).

- **Success / Giá tăng:** `hsl(142, 71%, 45%)` (Emerald).
- **Destructive / Giá giảm / Error:** `hsl(0, 84%, 60%)` (Red/Rose).
- **Warning:** `hsl(38, 92%, 50%)` (Amber).
- **Info:** `hsl(221, 83%, 53%)` (Blue).
