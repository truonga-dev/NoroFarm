# Tích hợp Công cụ Tìm kiếm (Search Engine Integration)

## Mục tiêu
Do NoroFarm chứa hàng ngàn bài báo, bản tin và dữ liệu giá cả từ nhiều năm. Hệ thống tìm kiếm có sẵn của PostgreSQL (Dùng lệnh `LIKE` hoặc `ILIKE`) sẽ quá chậm chạp và không xử lý được lỗi chính tả (Typo tolerance). Cần một Engine Tìm kiếm chuyên dụng.

## Nhà cung cấp đề xuất
1. **Algolia:** Vua của tìm kiếm Frontend. Trải nghiệm người dùng vô địch (Tìm kiếm nhanh như chớp ngay khi vừa gõ chữ), nhưng giá khá cao.
2. **Meilisearch:** Giải pháp thay thế mã nguồn mở tuyệt vời nhất. Nhanh tương đương Algolia, có thể tự Hosting (Tự cài lên VPS).
3. **Typesense:** Tương tự Meilisearch.

## Luồng Đồng bộ Dữ liệu (Data Sync)
Công cụ tìm kiếm bên thứ 3 hoạt động bằng cách tạo một "Bản sao thu nhỏ" của Database.
- **FastAPI Hooks:** Mỗi khi Biên tập viên Bấm nút "Xuất bản" bài viết mới (Hoặc Cập nhật/Xóa). Backend FastAPI sau khi lưu vào DB PostgreSQL thành công, phải gọi thêm 1 lệnh API sang Server của Algolia/Meilisearch để Đồng bộ Dữ liệu Cập nhật (Upsert/Delete Record).
- Không để dữ liệu trên Search Engine bị lệch (Out-of-sync) so với Database thật.

## Trải nghiệm Tìm kiếm (Search UX)
- **Instant Search:** Dùng UI Library của Algolia/Meilisearch gắn vào Next.js. Khi người dùng bấm vào ô Tìm kiếm trên Header (Vd gõ chữ "Rob"), một Popup nhỏ xổ xuống hiển thị ngay lập tức các gợi ý "Giá cà phê Robusta" mà không cần bấm phím Enter hay chuyển trang.
- **Bôi đậm Từ khóa (Highlighting):** Các từ khóa khớp sẽ được in đậm màu vàng trong kết quả.
