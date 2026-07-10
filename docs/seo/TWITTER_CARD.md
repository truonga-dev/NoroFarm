# Thẻ Twitter (Twitter Cards)

## Mục tiêu
Tương tự như Open Graph, nhưng dành riêng cho nền tảng X (Twitter). Giúp NoroFarm hiển thị chuyên nghiệp khi các bản tin thị trường cà phê (vốn rất phổ biến trên X toàn cầu) được chia sẻ.

## Cấu trúc Cần thiết
NoroFarm sẽ sử dụng định dạng Thẻ Hình ảnh lớn (Large Image Card) để chiếm nhiều diện tích nhất có thể trên Newsfeed (Dòng thời gian).

- `twitter:card`: Giá trị BẮT BUỘC phải là `summary_large_image`. (Nếu để `summary`, hình ảnh sẽ hiển thị dưới dạng hình vuông bé xíu bên cạnh đoạn text, rất mất thẩm mỹ).
- `twitter:site`: Tên tài khoản Twitter chính thức của NoroFarm (Ví dụ: `@NoroFarm`).
- `twitter:creator`: Tên tài khoản Twitter của Tác giả bài viết (Tùy chọn).
- `twitter:title`: Tiêu đề bài viết (Tối đa 70 ký tự).
- `twitter:description`: Tóm tắt (Tối đa 200 ký tự).
- `twitter:image`: Link hình ảnh (Tái sử dụng chung bức ảnh của `og:image` với kích thước `1200x630`).

## Tương thích ngược (Fallback)
Mặc dù X (Twitter) có bộ thẻ riêng, nhưng hệ thống của X đủ thông minh để đọc ké thẻ Open Graph (`og:title`, `og:image`) nếu thẻ `twitter:` bị thiếu. Tuy nhiên, thuộc tính `twitter:card` là bắt buộc phải khai báo để kích hoạt giao diện Large Image.
