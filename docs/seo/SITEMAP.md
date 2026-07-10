# Sơ đồ Trang Web (Sitemap.xml)

## Mục tiêu
Cung cấp một bản đồ hoàn chỉnh định tuyến tất cả các đường link (URL) quan trọng của NoroFarm. Khi Googlebot vào trang, nó sẽ đọc file này đầu tiên để biết cần phải quét (Crawl) những trang nào mà không bị sót.

## Kiến trúc Sitemap Động (Dynamic Sitemap)
Vì hệ thống có hàng ngàn bài viết và hàng chục trang giá nông sản được sinh ra mỗi ngày, không thể viết file `sitemap.xml` bằng tay (Tĩnh).
NoroFarm phải sử dụng tính năng **Dynamic Route** (`sitemap.js` hoặc `sitemap.ts`) của Next.js để tự động sinh sitemap mỗi khi có lượt truy cập vào đường dẫn `norofarm.com/sitemap.xml`.

## Nội dung bắt buộc trong Sitemap
Mỗi thẻ `<url>` trong Sitemap phải cung cấp 3 thông tin:
1. `<loc>`: Đường dẫn tuyệt đối (VD: `https://norofarm.com/gia-ca-phe`).
2. `<lastmod>`: Ngày chỉnh sửa gần nhất. Rất quan trọng để báo cho Google biết trang này vừa cập nhật giá mới, vào quét lại đi.
3. `<changefreq>`: Tần suất thay đổi. (Trang giá cả để là `hourly`, trang Bài viết để là `monthly`).

## Phân mảnh Sitemap (Sitemap Index)
Nếu hệ thống phát triển lớn hơn 50,000 URLs (Ví dụ có quá nhiều tin tức), file `sitemap.xml` duy nhất sẽ bị quá tải.
**Giải pháp:** Chia nhỏ thành nhiều file (Ví dụ: `sitemap-news.xml`, `sitemap-prices.xml`) và gộp chung bằng một file `sitemap-index.xml`.

## Lệnh Ping (Tùy chọn)
Mỗi khi có bài báo mới quan trọng, Backend có thể tự động gọi một lệnh HTTP (Ping) đến Google Search Console để yêu cầu Index ngay lập tức thay vì phải chờ con Bọ tự đến.
