# Giao thức Open Graph (Facebook / Zalo)

## Mục tiêu
Open Graph (OG) là giao thức chuẩn do Facebook tạo ra, được sử dụng rộng rãi bởi Zalo, LinkedIn, iMessage để vẽ (Render) ra một tấm "Thẻ xem trước" (Preview Card) cực kỳ đẹp mắt khi người dùng copy và dán Link (URL) của NoroFarm vào khung chat.

## Tầm quan trọng
- Khi người dùng gửi link "Giá cà phê hôm nay" cho bạn bè trên Zalo, nếu chỉ hiện dòng chữ xanh khô khan, tỷ lệ bấm vào rất thấp.
- Nếu hiện ra một Tấm ảnh to, tiêu đề in đậm "GIÁ CÀ PHÊ TĂNG KỶ LỤC KẾT THÚC TUẦN", tỷ lệ Click (CTR) tăng 200%.

## Các thẻ OG Bắt buộc (Mandatory Tags)
Trong cặp `<head>` của Next.js, luôn phải Render các thuộc tính sau:
- `og:type`: Xác định loại trang (Ví dụ: `website` cho trang chủ, `article` cho bài báo).
- `og:url`: Link canonical chuẩn của trang hiện tại.
- `og:title`: Có thể giống hoặc khác với Meta Title. Khuyến nghị viết kích thích sự tò mò (Click-bait) để thu hút người dùng Mạng xã hội.
- `og:description`: Tóm tắt nội dung (Dài 1-2 câu).
- `og:site_name`: Cố định là `NoroFarm`.

## OG Image (Đặc biệt quan trọng)
- **Độ phân giải chuẩn:** `1200 x 630 pixels` (Tỷ lệ 1.91:1).
- **Dung lượng:** Dưới 8MB (Khuyến nghị dùng JPG/WebP dưới 1MB để load nhanh trên 3G).
- **Tính năng Động (Dynamic OG Image):** 
  - Khuyến nghị Next.js sử dụng thư viện `@vercel/og` để TỰ ĐỘNG sinh ra bức ảnh này (Image Generation) bằng Code dựa trên Tiêu đề bài viết, thay vì bắt Editor phải thiết kế thủ công từng ảnh một trên Photoshop.
