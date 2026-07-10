# Figma Design System: NoroFarm

Hệ thống thiết kế này là nguồn sự thật duy nhất (Single Source of Truth) cho toàn bộ UI/UX của NoroFarm, được cấu trúc theo chuẩn của một Figma Design System cấp độ Enterprise (như Apple, Linear, Vercel).

---

## 1. Brand Guidelines (Quy chuẩn Thương hiệu)

### 1.1 Logo Usage (Quy tắc sử dụng Logo)
- **Tệp nguồn:** Logo bắt buộc phải sử dụng định dạng vector (SVG) lấy từ `/assets/logo`.
- **Màu sắc Logo:** 
  - Trên nền sáng (Light Mode): Sử dụng logo màu Emerald nguyên bản hoặc Đen (Slate-900).
  - Trên nền tối (Dark Mode): Sử dụng logo màu Trắng (White) hoặc xanh nhạt.
- **Biến thể:** Dùng Logo Full (Icon + Text) cho Header/Footer desktop. Dùng Logo Mark (Chỉ Icon) cho Mobile hoặc Favicon.

### 1.2 Logo Safe Area (Vùng an toàn)
- Khoảng cách an toàn xung quanh logo (clear space) phải bằng tối thiểu chiều cao của chữ "N" trong logo. KHÔNG được đặt bất kỳ thành phần đồ họa hay typography nào xâm phạm vào vùng này.

### 1.3 Logo Size (Kích thước)
- **Desktop Header:** Chiều cao (Height) 32px hoặc 40px.
- **Mobile Header:** Chiều cao 24px hoặc 28px.
- **Favicon/App Icon:** 16x16px, 32x32px, 192x192px.

---

## 2. Color Palette (Bảng màu)

Sử dụng hệ màu HSL/HEX. Cần thiết lập cả Light và Dark mode token (tham khảo chi tiết ở tài liệu Color System).

### 2.1 Mức độ ưu tiên
- **Primary (Chính):** Khắc họa thương hiệu (Nông nghiệp/Công nghệ).
  - Base: `#10B981` (Emerald-500)
  - Hover/Focus: `#059669` (Emerald-600)
- **Secondary (Phụ):** Dùng cho background, thẻ nhấn mạnh phụ.
  - Light: `#F3F4F6` (Gray-100)
  - Dark: `#1F2937` (Gray-800)

### 2.2 Semantic Colors (Ngữ nghĩa)
- **Success (Thành công / Giá Tăng):** `#22C55E` (Green-500)
- **Warning (Cảnh báo):** `#F59E0B` (Amber-500)
- **Error (Lỗi / Giá Giảm):** `#EF4444` (Red-500)
- **Information (Thông tin):** `#3B82F6` (Blue-500)

### 2.3 Neutral Colors (Trung tính)
- **Nền (Background):** `#FFFFFF` (Light) / `#0A0A0A` (Dark)
- **Văn bản chính (Text High-Contrast):** `#0F172A` (Light) / `#F8FAFC` (Dark)
- **Văn bản phụ (Text Muted):** `#64748B` (Light) / `#94A3B8` (Dark)
- **Viền (Border):** `#E2E8F0` (Light) / `#27272A` (Dark)

---

## 3. Typography (Kiểu chữ)

- **Phông chữ mặc định:** `Geist` hoặc `Inter` (Sans-serif).
- **Phông chữ số liệu:** `Geist Mono` (Tabular nums).

### 3.1 Typography Scale (Thang kích thước)
- **H1 (Display):** 48px - 60px (Mobile: 36px) | Tracking: -0.04em | Leading: 1.1
- **H2 (Title):** 30px - 36px (Mobile: 24px) | Tracking: -0.02em | Leading: 1.2
- **H3 (Subtitle):** 24px | Tracking: -0.01em | Leading: 1.3
- **Body Large:** 18px | Leading: 1.6
- **Body Base:** 16px | Leading: 1.5 (Kích thước mặc định cho Text input, Paragraph)
- **Body Small:** 14px | Leading: 1.4 (Dùng cho phụ đề, Label form)
- **Caption:** 12px | Leading: 1.4 | Uppercase (Tùy chọn)

### 3.2 Font Weight (Độ đậm)
- **Regular (400):** Nội dung văn bản chung.
- **Medium (500):** Nút bấm (Button), Tiêu đề thẻ nhỏ.
- **SemiBold (600):** Tiêu đề trang (H2, H3), Dữ liệu giá cả quan trọng.
- **ExtraBold (800):** Tiêu đề Hero (H1) để tạo điểm nhấn mạnh mẽ.

---

## 4. Layout & Spacing (Bố cục và Khoảng cách)

### 4.1 Spacing Scale (Khoảng cách)
Theo chuẩn 8px grid.
- **Micro:** 4px (Spacing trong nội bộ 1 component).
- **Small:** 8px, 12px (Khoảng cách giữa Text và Icon).
- **Medium:** 16px, 24px (Padding của Card, Input).
- **Large:** 32px, 48px (Khoảng cách giữa các khối nội dung).
- **Extra Large:** 64px, 96px, 128px (Khoảng cách giữa các Section trên Landing Page).

### 4.2 Responsive Breakpoints
- **Mobile (sm):** `< 640px` (Mặc định).
- **Tablet (md):** `≥ 768px`.
- **Desktop (lg):** `≥ 1024px`.
- **Large Desktop (xl):** `≥ 1280px` (Container max-width dừng ở mốc này).

---

## 5. Visual Properties (Thuộc tính thị giác)

### 5.1 Border Radius (Bo góc)
- **sm (4px):** Checkbox, Tooltip nhỏ.
- **md (8px):** Nút bấm (Button), Input Field, Dropdown menu.
- **lg (12px) / xl (16px):** Thẻ Card, Modal, Dialog.
- **full (9999px):** Avatar, Badge, Radio Button.

### 5.2 Shadow & Elevation (Đổ bóng & Độ sâu)
Shadow chỉ áp dụng mạnh ở Light Mode. Dark mode phụ thuộc vào Border.
- **Elevation 1 (Shadow-sm):** Dùng cho Card tĩnh. Rất mờ.
- **Elevation 2 (Shadow-md):** Dùng khi Hover Card hoặc Dropdown nhỏ.
- **Elevation 3 (Shadow-xl):** Dùng cho Modal pop-up, Command Palette. Đổ bóng rộng và sâu.

### 5.3 Glass Effect (Kính mờ)
- **Header / Navigation:** Nền màu chính (White/Black) với Opacity 70% + Blur 12px. Giúp giao diện xuyên thấu khi cuộn nội dung.

### 5.4 Gradient (Chuyển màu sắc)
- Chỉ dùng cho trạng thái đặc biệt (Ví dụ: Chữ Hero H1).
- Hướng mặc định: Từ trên xuống dưới (`to-b`) hoặc chéo (`to-br`).
- Màu: Từ Primary (Xanh lá) sang trong suốt hoặc xanh dương nhạt.

---

## 6. Asset Guidelines

### 6.1 Icon Library
- Sử dụng **Lucide React**.
- Stroke width cố định: `1.5px` (hoặc `2px` cho mobile).
- Màu sắc kế thừa (`currentColor`), trừ khi là icon chức năng semantic (như nút Xóa đỏ).

### 6.2 Illustration Style
- Nếu có, sử dụng phong cách đồ họa Line-art 2D, tối giản (Minimalist), stroke tương đồng với Icon.
- Không dùng hình họa 3D lố lăng hay hình hoạt hình nhiều màu sắc.

---

## 7. Component Styles (Phong cách Thành phần)

### 7.1 Button Style (Nút bấm)
- **Primary:** Màu nền nổi bật (Emerald), chữ trắng, bo góc 8px. Hover: Giảm nhẹ độ sáng nền, scale down 0.98 khi click (Active).
- **Outline:** Nền trong suốt, viền xám mỏng. Dành cho nút phụ.
- **Ghost:** Không viền, chỉ hiện viền/nền khi hover. Dùng cho thanh công cụ.

### 7.2 Input Style (Nhập liệu)
- Chiều cao chuẩn 40px (Desktop), 48px (Mobile).
- Không màu nền, viền xám nhạt 1px. 
- Khi focus: Viền sáng lên (Ring xanh 2px).
- Placeholder: Màu xám nhạt (`text-muted`).

### 7.3 Card Style (Thẻ)
- Outline mỏng (`1px border`), bo góc 12px hoặc 16px.
- Padding mặc định là 24px (Desktop) hoặc 16px (Mobile).
- Không có shadow trong Dark Mode.

### 7.4 Navigation Style (Điều hướng)
- **Top Header:** Cố định, mờ ảo (Glassmorphism), có logo bên trái, avatar bên phải.
- **Mobile Bottom Nav:** Nền trong suốt 80%, viền trên 1px, chứa 4-5 icon chính. Active icon đổi màu Primary.

### 7.5 Modal Style (Cửa sổ bật lên)
- Nằm giữa màn hình, đằng sau là một lớp phủ mờ đen (Backdrop 50%).
- Hiệu ứng xuất hiện: Zoom in nhẹ (`0.95 -> 1`) kết hợp Fade In.

### 7.6 Toast Style (Thông báo)
- Nổi lên từ góc dưới bên phải màn hình.
- Kích thước nhỏ gọn, chứa 1 icon trạng thái (V/X), tiêu đề ngắn gọn. Tự tắt sau 3-5s.

### 7.7 Loading Style
- Sử dụng Spinner tròn, đường viền mỏng (Cùng style với Lucide Icon).
- Không dùng thanh Progress bar lặp đi lặp lại.

### 7.8 Skeleton Style
- Hiển thị mô phỏng khung xương của nội dung với màu xám nhạt.
- Có hiệu ứng Shimmer (chuyển động ánh sáng lướt qua) với độ mượt cao.
- **Quan trọng:** Kích thước Skeleton phải khớp 100% với nội dung thật để tránh Cumulative Layout Shift (CLS).

---

## 8. Motion & UX (Chuyển động & Trải nghiệm)

### 8.1 Animation Principle (Nguyên tắc)
- Mọi chuyển động phải có mục đích (Functional Animation).
- Không làm phiền trải nghiệm đọc hoặc lấy thông tin nhanh.
- Không gây chóng mặt (Tránh xoay tròn, nhảy vọt).

### 8.2 Motion Timing (Thời gian)
- **Fast (Nhanh):** 100ms - 150ms. Dành cho Hover button, Toggle.
- **Normal (Bình thường):** 200ms - 300ms. Dành cho Fade-in card, Toast notification.
- **Slow (Chậm):** 500ms+. Dành cho Page Transition (Framer Motion spring physics).
- **Spring Defaults:** Damping (Lực cản) 30, Stiffness (Độ cứng) 400.

### 8.3 Accessibility - WCAG (Khả năng tiếp cận)
- **Tương phản (Contrast Ratio):** Phải đạt tối thiểu `4.5:1` cho Text cơ bản và `3:1` cho Text lớn (Theo chuẩn WCAG 2.1 AA).
- **Focus Rings:** Mọi đối tượng tương tác phải có Outline/Ring rõ ràng khi dùng phím `Tab` để di chuyển (Không bao giờ set `outline: none` mà không có kiểu thay thế).
- **Screen Readers:** Các hình ảnh, icon chức năng phải có thuộc tính `aria-label` hoặc thẻ `alt`. Button icon-only bắt buộc có nhãn mô tả ẩn (`sr-only`).
