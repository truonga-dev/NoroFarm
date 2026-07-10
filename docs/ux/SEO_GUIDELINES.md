# SEO Guidelines (Tối ưu Công cụ Tìm kiếm)

NoroFarm là một Digital Platform, việc thu hút lượng truy cập tự nhiên (Organic Traffic) thông qua Google là nguồn sống cốt lõi. Cấu trúc trang web được sinh ra để thống trị các từ khóa như "Giá cà phê hôm nay", "Giá sầu riêng Đắk Lắk".

## 1. Cấu trúc URL (URL Structure)
- URLs phải ngắn, chứa từ khóa, không có ký tự loằng ngoằng.
- ✅ Tốt: `/gia-nong-san/ca-phe` hoặc `/tin-tuc/gia-ca-phe-tang-dot-bien`
- ❌ Xấu: `/category=1&item=2` hoặc `/news/12345`

## 2. Thẻ Meta & Semantic HTML
Mọi trang trên hệ thống (Sử dụng Next.js Metadata API) phải có đủ:
- **Title Tag:** Tối ưu độ dài < 60 ký tự. Có công thức động. 
  - VD: `Giá Cà Phê Hôm Nay [Ngày] - Tăng/Giảm Cập Nhật Liên Tục | NoroFarm`
- **Meta Description:** Đoạn văn 150 ký tự tóm tắt đúng trọng tâm, chứa từ khóa chính, kích thích click.
- **Thẻ H1 - H6:** Tuân thủ hệ thống thứ bậc nghiêm ngặt. Mỗi trang chỉ có DUY NHẤT một thẻ `<h1>`. Không dùng thẻ `H` để chỉnh kích thước chữ (chữ to nhỏ chỉnh bằng CSS class, HTML tag giữ đúng ngữ nghĩa).

## 3. Open Graph (Chia sẻ Mạng xã hội)
Khi link của NoroFarm được copy gửi qua Zalo, Facebook:
- Phải hiển thị ảnh Cover vuông vức, rõ nét (`og:image`). Kích thước chuẩn 1200x630px.
- Ảnh Cover nên là ảnh động sinh ra từ dữ liệu (Dynamic OG Image / Vercel OG). Ví dụ: Chia sẻ link giá cà phê, ảnh hiện ra chính xác con số giá của ngày hôm đó.

## 4. Dữ liệu có cấu trúc (JSON-LD / Schema Markup)
Giúp Google hiểu rõ nội dung website để hiển thị Rich Snippets.
- Khai báo trang Tin tức là `Article` hoặc `NewsArticle`.
- Khai báo Bảng giá là `Dataset` hoặc cấu trúc tài chính phù hợp.
- Có thẻ Breadcrumbs Schema cho mọi trang để hiện cấu trúc điều hướng trên kết quả tìm kiếm Google.

## 5. Hiệu năng & Core Web Vitals
Google ưu tiên xếp hạng các trang web tải nhanh.
- **LCP (Largest Contentful Paint):** Thời gian tải hình ảnh/khối text lớn nhất < 2.5s (Áp dụng Next.js Image Optimization).
- **CLS (Cumulative Layout Shift):** Tránh giật khung hình khi tải ảnh. Mọi khoảng trống hình ảnh và bảng giá phải được cấp phát sẵn kích thước (width/height) và hiện Skeleton trước. Chỉ số CLS lý tưởng < 0.1.
