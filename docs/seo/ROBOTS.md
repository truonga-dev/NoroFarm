# Tệp Robots (Robots.txt)

## Mục tiêu
Đóng vai trò là "Người bảo vệ cửa", thông báo cho các công cụ tìm kiếm (Googlebot, Bingbot, Baiduspider) biết chúng ĐƯỢC PHÉP và KHÔNG ĐƯỢC PHÉP thu thập dữ liệu (Crawl) ở những thư mục nào trên Website.

## Tầm quan trọng
- Ngăn Google lập chỉ mục (Index) các trang nội bộ nhạy cảm (Ví dụ: Trang quản trị Admin, Trang lấy lại mật khẩu).
- Tiết kiệm "Ngân sách thu thập dữ liệu" (Crawl Budget). Nếu để Google quét hàng ngàn trang vô dụng (Ví dụ các trang kết quả Tìm kiếm trắng), nó sẽ bỏ lỡ việc quét các Bài báo quan trọng.

## Cấu hình Tiêu chuẩn cho NoroFarm
File `robots.txt` phải được đặt ở thư mục gốc (Root) của Domain: `norofarm.com/robots.txt`.

```text
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /*?search=
Disallow: /*?sort=

Allow: /
Allow: /_next/image/

Sitemap: https://norofarm.com/sitemap.xml
```

## Lỗi thường gặp cần tránh
- **Tuyệt đối không** để dòng `Disallow: /` trên môi trường Production. Dòng này sẽ đuổi cổ toàn bộ Bot và đưa Website về 0 Traffic (Thường xảy ra khi cấu hình nhầm từ môi trường Staging mang lên Production).
- Các file JavaScript và CSS (nằm trong thư mục `/_next/`) phải luôn được Allow. Nếu cấm Bot đọc CSS, Googlebot sẽ thấy trang web bị vỡ Layout và đánh giá điểm SEO rất thấp.
