# Dữ liệu Cấu trúc (Structured Data / Schema.org)

## Mục tiêu
Giúp Googlebot "hiểu" dữ liệu trên NoroFarm thay vì chỉ "đọc" chữ. Khi Google hiểu được đây là Bài Báo, hoặc đây là Bảng Giá, NoroFarm sẽ có cơ hội được hiển thị ở các vị trí Đặc biệt (Rich Snippets) trên kết quả tìm kiếm, đè bẹp các đối thủ SEO thông thường.

## Định dạng Thực thi
NoroFarm BẮT BUỘC sử dụng định dạng **JSON-LD** (JavaScript Object Notation for Linked Data). Chèn đoạn mã JSON này vào thẻ `<script type="application/ld+json">` trong `<head>` của Next.js. Tuyệt đối không dùng Microdata chèn trực tiếp vào thẻ HTML vì rất khó bảo trì.

## Các loại Schema Cốt lõi của NoroFarm

### 1. WebSite (Trang chủ)
Khai báo trang chủ NoroFarm là một công ty (Organization) có tích hợp chức năng Tìm kiếm (SearchAction).
Giúp Google hiển thị ô Tìm kiếm NoroFarm ngay ngoài màn hình kết quả Google Search.

### 2. Article / NewsArticle (Trang Tin tức)
Khai báo bài viết là tin tức.
Bắt buộc có: `headline` (Tiêu đề), `datePublished` (Ngày đăng), `dateModified` (Ngày sửa), `author` (Tác giả), và `image` (Ảnh đại diện). Giúp bài viết có cơ hội xuất hiện trong thẻ "Google Top Stories" (Tin tức hàng đầu).

### 3. FAQPage (Trang Trợ giúp)
Khai báo trang chứa Danh sách Câu hỏi (Question) và Trả lời (Answer).
Giúp Google nhúng luôn câu trả lời của NoroFarm vào ô Accordion (People also ask) ngay trên Google Search mà người dùng không cần bấm vào link.

### 4. BreadcrumbList (Tất cả các trang)
Khai báo cấu trúc đường dẫn (Ví dụ: Trang chủ > Tin tức > Thị trường > Bài viết A).
Giúp Google hiển thị đường dẫn dễ nhìn thay vì một dải URL dài ngoằng trên kết quả tìm kiếm.

## Xác thực (Validation)
Mọi đoạn code JSON-LD sau khi code xong phải được Copy và dán vào công cụ "Google Rich Results Test" để đảm bảo không bị thiếu thuộc tính bắt buộc (Missing required field).
