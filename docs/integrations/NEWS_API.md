# Tích hợp Nguồn Tin tức (News Aggregation API)

## Mục tiêu
Tự động tổng hợp các tin tức vĩ mô về nông nghiệp, tỷ giá, xuất nhập khẩu từ các tờ báo lớn (Báo Nông nghiệp, Reuters, Bloomberg) để bổ sung làm phong phú luồng Tin tức của NoroFarm (Bên cạnh tin do Admin tự viết).

## Phương pháp Tích hợp
1. **Sử dụng RSS Feeds (Khuyến nghị):**
   - Hầu hết các trang báo mạng đều cung cấp đường dẫn RSS (Định dạng XML).
   - Ví dụ: `https://nongnghiep.vn/rss/thi-truong.rss`.
   - Đây là cách nhanh, hợp pháp và ổn định nhất để lấy Tiêu đề, Tóm tắt và Link gốc của bài báo.
2. **Sử dụng News API Cấp 3:**
   - Dịch vụ trung gian như **NewsAPI.org**. Cung cấp JSON sạch sẽ của các tờ báo lớn toàn cầu bằng cách search theo Keyword (VD: "Robusta Coffee").

## Chiến lược Tích hợp
- **Xử lý Ngầm (Background Job):** Backend cấu hình Cronjob (Mỗi 1 tiếng) đi quét qua danh sách 10 link RSS đã được khai báo.
- **Lưu trữ Tạm (Feed Caching):** Phân tích file XML, biến thành JSON, lọc bỏ các bài báo đã tồn tại (Dựa trên Link bài hoặc Hash Tiêu đề).
- **Quy trình Duyệt (Moderation):** KHÔNG tự động đăng thẳng ra trang chủ. Các bài báo thu thập được sẽ rơi vào mục "Tin Tự Động" trên Admin CMS ở trạng thái BẢN NHÁP (Draft). Biên tập viên sẽ vào xem, nếu thấy hay thì bấm "Xuất bản", nếu thấy rác thì bấm "Xóa".

## Vấn đề Bản quyền (Copyright)
- Bắt buộc tuân thủ nguyên tắc Trích dẫn:
  - Chỉ hiển thị Tiêu đề, Ảnh Thumbnail và 2 dòng Tóm tắt (Excerpt).
  - Không bao giờ cào toàn bộ Nội dung bài viết (Full body content) của báo khác về web mình.
  - Khi độc giả bấm "Xem chi tiết", trình duyệt phải mở thẻ mới (Target `_blank`) trỏ thẳng sang trang gốc của tờ báo đó.
