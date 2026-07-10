# Landing Page Design Details - NoroFarm

Tài liệu này mô tả chi tiết cấp độ Component cho toàn bộ trang chủ (Landing Page/Home Page) của NoroFarm, cấu trúc theo 12 Section từ trên xuống dưới.

---

## 1. Hero Section

- **Mục đích:** Gây ấn tượng mạnh mẽ đầu tiên (Above the fold), giải thích ngay giá trị cốt lõi (Bảng giá Nông sản chuẩn xác nhất).
- **Layout/Grid:** 1 Cột căn giữa (Single Column Centered).
- **Margin/Padding:** `pt-32 pb-24` (Desktop), `pt-24 pb-16` (Mobile).
- **Font:** 
  - Headline H1: `text-6xl font-extrabold tracking-tight` (60px).
  - Sub-headline: `text-xl text-muted-foreground` (20px).
- **Màu:** Nền Trắng/Đen (Background base). Chữ H1 màu `text-foreground`. Nút bấm `bg-primary`.
- **Icon:** Không sử dụng icon trong H1 để giữ sự tối giản. Nút CTA dùng icon mũi tên phải `Lucide: ArrowRight`.
- **Animation:** Fade-in-up cho Text. Nút CTA hover scale 0.98.
- **Responsive:** Trên Mobile, H1 giảm còn `text-4xl` (36px).
- **SEO:** Headline chính bắt buộc là thẻ `<h1>` duy nhất trên trang.
- **Accessibility:** Tương phản nút CTA đạt 4.5:1. Nút có `aria-label="Khám phá ngay"`.

**Wireframe:**
```text
+--------------------------------------------------+
|                                                  |
|       H1: Nền Tảng Dữ Liệu Nông Nghiệp           |
|            Số 1 Việt Nam                         |
|                                                  |
|     (Sub) Cập nhật giá cà phê, hồ tiêu, sầu      |
|           riêng nhanh và chuẩn xác nhất.         |
|                                                  |
|            [ Xem Giá Ngay -> ]                   |
|                                                  |
+--------------------------------------------------+
```

---

## 2. Trust Section (Social Proof)

- **Mục đích:** Tạo độ tin cậy bằng cách hiển thị các đối tác, nguồn dữ liệu hoặc số liệu ấn tượng.
- **Layout/Grid:** Dải ngang (Marquee) chạy vô tận.
- **Margin/Padding:** `py-12` (Trên và dưới 48px).
- **Font:** Label: `text-sm text-muted-foreground uppercase tracking-widest`.
- **Màu:** Logo đối tác dạng Grayscale (Trắng đen). Hover: Đổi sang màu nguyên bản.
- **Icon:** SVG Logos.
- **Animation:** Infinite auto-scroll (CSS `@keyframes marquee`). Dừng cuộn khi hover (Pause on hover).
- **Responsive:** Tốc độ cuộn trên Mobile chậm hơn để dễ nhìn.
- **SEO/Accessibility:** Cần có `alt text` cho tất cả logo đối tác. Nếu dùng ảnh nền, dùng thẻ `div` với `aria-hidden="true"`.

**Wireframe:**
```text
+--------------------------------------------------+
|     ĐƯỢC TIN TƯỞNG BỞI CÁC ĐỐI TÁC HÀNG ĐẦU      |
|                                                  |
|  [Logo 1]    [Logo 2]    [Logo 3]    [Logo 4]    |
+--------------------------------------------------+
```

---

## 3. Coffee Price (Giá Cà Phê Chớp Nhoáng)

- **Mục đích:** Đưa dữ liệu quan trọng nhất (Cà phê) ra ngay mặt tiền để người dùng không phải click.
- **Layout/Grid:** CSS Grid `grid-cols-4` (Desktop) -> `grid-cols-2` (Tablet) -> `grid-cols-1` (Mobile).
- **Margin/Padding:** `py-24`. Khoảng cách giữa các thẻ (Gap): `gap-6`.
- **Font:** Giá tiền: `text-3xl font-bold tabular-nums`.
- **Màu:** Tên vùng: `text-foreground`. Giá: `text-primary` (Nếu tăng), `text-destructive` (Nếu giảm).
- **Icon:** `Lucide: TrendingUp`, `TrendingDown`.
- **Animation:** Số nhảy mượt mà từ 0 lên giá thực tế (Number counter) khi Scroll vào khung hình.
- **Responsive:** Trên Mobile, biến thành danh sách dọc.
- **SEO/Accessibility:** Bọc danh sách bằng thẻ `<ul>`, thẻ item `<li>`. Có Text fallback cho người khiếm thị "Giá tăng", "Giá giảm".

**Wireframe:**
```text
+--------------------------------------------------+
|  Giá Cà Phê Hôm Nay (Cập nhật 5 phút trước)      |
|                                                  |
|  [Đắk Lắk  ]  [Lâm Đồng ]  [Gia Lai  ]  [Đắk Nông] |
|  [110.000 đ]  [109.500 đ]  [109.800 đ]  [109.700 ] |
|  [+500/↑   ]  [+400/↑   ]  [+500/↑   ]  [-100/↓  ] |
+--------------------------------------------------+
```

---

## 4. Commodity Price (Nông Sản Khác)

- **Mục đích:** Hiển thị giá các loại nông sản chủ lực khác (Tiêu, Sầu riêng, Lúa gạo).
- **Layout/Grid:** Cấu trúc Bento Box. 1 thẻ lớn bên trái, 2 thẻ nhỏ bên phải.
- **Margin/Padding:** `py-24`.
- **Font:** Tiêu đề thẻ `text-xl font-semibold`.
- **Màu:** Card có nền `bg-surface`, viền `border` 1px.
- **Icon:** Icon thực vật tương ứng mờ nhạt làm Background hoặc góc phải.
- **Animation:** Hover nhấc thẻ lên (Lift effect `translate-y-[-2px]`).
- **Responsive:** Chuyển về 1 cột dọc (Stacking) trên màn hình dưới 768px.
- **SEO/Accessibility:** Sử dụng Heading `<h2>` cho tiêu đề khu vực.

**Wireframe:**
```text
+--------------------------------------------------+
|  Thị Trường Nông Sản Nổi Bật                     |
|                                                  |
|  +--------------------+  +--------------------+  |
|  | Hồ Tiêu            |  | Sầu Riêng RI6      |  |
|  | 150.000đ/kg        |  | 90.000đ/kg         |  |
|  +--------------------+  +--------------------+  |
|                          | Gạo ST25           |  |
|                          | 35.000đ/kg         |  |
|                          +--------------------+  |
+--------------------------------------------------+
```

---

## 5. Weather (Thời Tiết)

- **Mục đích:** Thông tin khí tượng dành riêng cho vùng nguyên liệu.
- **Layout/Grid:** Thanh ngang dài (Dashboard strip).
- **Margin/Padding:** `py-16`. Khung Weather có `p-6`.
- **Font:** Nhiệt độ `text-4xl`. Tên tỉnh `text-lg`.
- **Màu:** Nền Gradient xanh dương nhẹ (Light mode) hoặc xanh dương rất tối (Dark mode).
- **Icon:** Bộ icon thời tiết chuyên dụng (Nắng, Mưa, Mây) kích thước lớn `size-12`.
- **Animation:** Icon có animation nhẹ (Mặt trời xoay, Mây trôi).
- **Responsive:** Cuộn ngang (Horizontal scroll) trên Mobile nếu danh sách Tỉnh quá dài.
- **SEO/Accessibility:** Có mô tả bằng chữ (Ví dụ: `alt="Trời mưa to"`).

**Wireframe:**
```text
+--------------------------------------------------+
|  Thời tiết vùng nguyên liệu                      |
|                                                  |
|  (Icon Mưa) Đắk Lắk   (Icon Nắng) Lâm Đồng       |
|  28°C - Mưa rào       30°C - Nắng gắt            |
+--------------------------------------------------+
```

---

## 6. Market Trend (Biểu Đồ Xu Hướng)

- **Mục đích:** Tổng quan chu kỳ tăng giảm 7 ngày/30 ngày.
- **Layout/Grid:** Card khổ rộng (`col-span-full`).
- **Margin/Padding:** `py-24`.
- **Font:** Chú giải (Legend) `text-sm`.
- **Màu:** Đường Line biểu đồ màu Primary (Xanh) và Warning (Vàng).
- **Icon:** `Lucide: BarChart`.
- **Animation:** Đường biểu đồ vẽ tự động từ trái sang phải (Stroke-dashoffset animation).
- **Responsive:** Trên Mobile, biểu đồ tự động giảm độ chi tiết (Ít mốc thời gian hơn).
- **SEO/Accessibility:** SVG Chart bắt buộc có thẻ `<title>` và `<desc>` giải thích biểu đồ bằng văn bản.

**Wireframe:**
```text
+--------------------------------------------------+
|  Xu Hướng Giá (7 Ngày)                           |
|                                                  |
|  120k |     /---.                                |
|  110k |   /       \____                          |
|  100k | _/              ---                      |
|       |____________________                      |
|         T2  T3  T4  T5  T6                       |
+--------------------------------------------------+
```

---

## 7. News (Tin Tức Thị Trường)

- **Mục đích:** Cập nhật bản tin nội bộ và tin tổng hợp vĩ mô.
- **Layout/Grid:** Grid 3 cột (3 Cards).
- **Margin/Padding:** `py-24`.
- **Font:** Tiêu đề tin `text-lg font-semibold line-clamp-2`.
- **Màu:** Tag danh mục màu `bg-secondary text-secondary-foreground`.
- **Icon:** `Lucide: ArrowUpRight` (Nút đọc tiếp).
- **Animation:** Hover vào Card -> Ảnh Cover zoom nhẹ 105%.
- **Responsive:** `grid-cols-1` trên Mobile, `grid-cols-2` trên Tablet.
- **SEO/Accessibility:** Schema `NewsArticle`. Ảnh bắt buộc có `alt`. Dùng thẻ `<a>` bao trọn Card nhưng cấu trúc HTML bên trong phải đúng ngữ nghĩa.

**Wireframe:**
```text
+--------------------------------------------------+
|  Tin Tức Mới Nhất                                |
|                                                  |
|  [Ảnh Cover]       [Ảnh Cover]      [Ảnh Cover]  |
|  [Tag]             [Tag]            [Tag]        |
|  Tiêu đề bài 1     Tiêu đề bài 2    Tiêu đề bài 3|
|  12/07/2026        12/07/2026       11/07/2026   |
+--------------------------------------------------+
```

---

## 8. Statistics (Thống Kê Ẩn Tượng)

- **Mục đích:** Khẳng định vị thế nền tảng.
- **Layout/Grid:** Grid 3 cột căn giữa.
- **Margin/Padding:** `py-32`.
- **Font:** Số liệu `text-5xl font-bold tabular-nums`.
- **Màu:** Toàn bộ Section có màu nền Inverse (Trắng trên nền Xanh/Đen).
- **Icon:** Không sử dụng để giữ sự tối giản.
- **Animation:** Đếm số (Count-up) khi cuộn tới.
- **Responsive:** Mobile xếp chồng dọc.
- **SEO/Accessibility:** Dùng `aria-hidden` cho hiệu ứng count-up, hiện số tĩnh trong screen reader.

**Wireframe:**
```text
+--------------------------------------------------+
|                                                  |
|       1.2M+             50+              Realtime|
|     Người dùng       Tỉnh thành          Cập nhật|
|                                                  |
+--------------------------------------------------+
```

---

## 9. About (Giới thiệu Ngắn)

- **Mục đích:** Xây dựng sự đồng cảm. Tại sao NoroFarm ra đời.
- **Layout/Grid:** 2 Cột (Trái: Ảnh/Video, Phải: Text).
- **Margin/Padding:** `py-24`.
- **Font:** Body `text-lg leading-relaxed text-muted-foreground`.
- **Màu:** Nền xen kẽ màu Surface (Xám nhạt).
- **Icon:** Logo NoroFarm mờ đằng sau ảnh.
- **Animation:** Fade-in-right cho ảnh, Fade-in-left cho Text.
- **Responsive:** Mobile: Text nhảy lên trên, Ảnh nằm dưới.
- **SEO/Accessibility:** Alt text chi tiết cho hình ảnh "Người nông dân đang dùng NoroFarm".

**Wireframe:**
```text
+--------------------------------------------------+
|                                                  |
|  +--------------+   Về NoroFarm                  |
|  |              |                                |
|  |  Ảnh Nông    |   Chúng tôi xây dựng công      |
|  |  Dân / Tech  |   nghệ này với một sứ mệnh     |
|  |              |   mang lại sự công bằng...     |
|  +--------------+                                |
|                     [ Đọc thêm về chúng tôi ]    |
+--------------------------------------------------+
```

---

## 10. FAQ (Câu Hỏi Thường Gặp)

- **Mục đích:** Giải đáp thắc mắc, giữ chân người dùng.
- **Layout/Grid:** Khối Accordion hẹp căn giữa (`max-w-3xl`).
- **Margin/Padding:** `py-24`.
- **Font:** Câu hỏi `font-medium`.
- **Màu:** Chữ xám đậm, đường viền `border-b` chia các câu hỏi.
- **Icon:** `Lucide: Plus/Minus` hoặc `ChevronDown/Up`.
- **Animation:** Mở rộng xuống (Height transition), Icon xoay 180 độ.
- **Responsive:** Tràn viền (Full-width padding 16px) trên Mobile.
- **SEO/Accessibility:** Sử dụng Schema `FAQPage`. Dùng thuộc tính `aria-expanded` để báo cho Screen reader.

**Wireframe:**
```text
+--------------------------------------------------+
|  Câu Hỏi Thường Gặp                              |
|                                                  |
|  Dữ liệu giá lấy từ đâu?                     [+] |
|  ----------------------------------------------- |
|  Tôi có cần trả phí không?                   [-] |
|  NoroFarm hoàn toàn miễn phí cho bà con nông     |
|  dân tra cứu thông tin hàng ngày.                |
|  ----------------------------------------------- |
|  Làm sao để đăng tin mua bán?                [+] |
+--------------------------------------------------+
```

---

## 11. CTA (Kêu Gọi Hành Động Mạng Lưới)

- **Mục đích:** Push user cài đặt PWA hoặc tạo tài khoản.
- **Layout/Grid:** 1 Khối bao bọc (`bg-primary`), Text căn giữa.
- **Margin/Padding:** `py-24`. Khung CTA có góc bo `rounded-3xl` lớn.
- **Font:** Headline H2 `text-4xl text-primary-foreground`.
- **Màu:** Background Emerald, Chữ Trắng. Nút màu Trắng chữ Emerald (Inverted).
- **Icon:** Không dùng icon.
- **Animation:** Không có animation phức tạp, tập trung vào Nút bấm đập nhịp (Pulse) nhẹ.
- **Responsive:** Border-radius nhỏ lại trên mobile.
- **SEO/Accessibility:** Độ tương phản chữ trắng trên nền xanh Emerald phải đạt chuẩn (Chỉnh độ đậm của xanh nếu cần).

**Wireframe:**
```text
+--------------------------------------------------+
|  +--------------------------------------------+  |
|  |                                            |  |
|  |   Luôn Nắm Bắt Thị Trường Nông Sản         |  |
|  |   Cài đặt ứng dụng hoặc xem giá mỗi ngày   |  |
|  |                                            |  |
|  |         [ Xem Bảng Giá Đầy Đủ ]            |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

---

## 12. Footer

- **Mục đích:** Điều hướng phụ, thông tin bản quyền, pháp lý.
- **Layout/Grid:** Grid 4 cột (Cột 1: Logo, Cột 2/3/4: Links). Phía dưới là dải Copyright.
- **Margin/Padding:** `pt-24 pb-12`.
- **Font:** Các link `text-sm text-muted-foreground`.
- **Màu:** Nền `bg-surface` hoặc đen tuyền `#000`.
- **Icon:** Social Icons (Facebook, Zalo).
- **Animation:** Hover link sáng lên.
- **Responsive:** Mobile gộp thành 1 cột dọc hoặc Accordion.
- **SEO/Accessibility:** Gắn thẻ `<nav>` cho các danh sách link. Dùng Semantic `<address>` cho địa chỉ công ty.

**Wireframe:**
```text
+--------------------------------------------------+
|                                                  |
|  [Logo]          Thị Trường    Tin Tức   Hỗ Trợ  |
|  Mang công nghệ  Cà phê        Vĩ mô     Liên hệ |
|  vào nông nghiệp Hồ tiêu       Kỹ thuật  FAQ     |
|                  Sầu riêng               Điều kho|
|                                                  |
|  ----------------------------------------------- |
|  © 2026 NoroFarm. All rights reserved. [FB] [ZA] |
+--------------------------------------------------+
```
