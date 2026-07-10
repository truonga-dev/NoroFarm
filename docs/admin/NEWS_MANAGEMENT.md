# Quản lý Tin tức (News Management)

## Mục tiêu
Công cụ Soạn thảo, Xuất bản và Quản lý nội dung (CMS) cho các bài viết Thị trường, Bản tin Khí tượng và Kiến thức Nông nghiệp trên NoroFarm. 

## Chức năng
- **Quản lý Vòng đời Bài viết (Lifecycle):** Bản nháp (Draft) -> Chờ duyệt (Pending) -> Đã xuất bản (Published) -> Đã ẩn/Lưu trữ (Archived).
- **Trình soạn thảo Đa phương tiện (Rich Text Editor):** Hỗ trợ viết bài, chèn hình ảnh, định dạng Heading, bôi đậm, chèn link nội bộ.
- **Tối ưu SEO:** Tùy chỉnh Tiêu đề (Meta Title), Mô tả (Meta Description), URL thân thiện (Slug) và ảnh OpenGraph (OG Image).
- **Phân loại:** Gắn bài viết vào Danh mục (Categories) và Nhãn (Tags).
- **Lập lịch (Scheduling):** Hẹn giờ xuất bản bài viết tự động trong tương lai.

## Layout
- **Danh sách Bài viết:** Bảng Table (Tiêu đề, Tác giả, Ngày đăng, Trạng thái, Lượt xem). Hỗ trợ Lọc theo Chuyên mục.
- **Màn hình Tạo/Sửa (Compose Page):** Chia 2 cột:
  - Cột chính (Trái - 70%): Nhập Tiêu đề, Trình soạn thảo Nội dung (WYSIWYG Editor), Tóm tắt (Excerpt).
  - Cột phụ (Phải - 30%): Khối Xuất bản (Status, Ngày giờ), Khối SEO, Khối Ảnh Đại diện (Thumbnail), Khối Phân loại (Category, Tags).

## UI / UX
- **UI:** Editor cần gọn gàng, giống trải nghiệm viết trên Notion hoặc Medium. Toolbar định dạng sẽ nổi lên khi bôi đen chữ (Floating Toolbar) thay vì cố định một đống nút bấm phía trên.
- **UX:** Tự động lưu nháp (Auto-save) mỗi 30 giây để tránh mất nội dung khi mất điện/mạng. Hỗ trợ Kéo thả (Drag & Drop) hình ảnh trực tiếp vào bài viết. Nút "Xem trước" (Preview) để mở ra giao diện giả lập giống Web thật.

## Quyền truy cập
- `news:read` (Chỉ xem danh sách).
- `news:create`, `news:update` (Nhà báo/Biên tập viên).
- `news:publish`, `news:delete` (Tổng biên tập / Quản lý). (Một BTV có thể viết bài nhưng phải chuyển trạng thái 'Chờ duyệt' để Sếp bấm 'Xuất bản').

## Validation
- Tiêu đề: Tối đa 150 ký tự. Không được trùng lặp Slug.
- Nội dung: Bắt buộc, độ dài tối thiểu 50 từ.
- Hình đại diện: Bắt buộc chọn. Kích thước tỷ lệ 16:9, tối đa 2MB.

## Luồng xử lý
1. Biên tập viên viết bài và dán Ảnh vào Editor.
2. Hình ảnh lập tức được Upload ngầm lên Cloud Storage, Editor chèn URL ảnh vào thẻ `<img>`.
3. Bấm "Lưu bản nháp". API `POST /news` lưu dữ liệu dạng trạng thái `DRAFT`.
4. Điền Meta SEO, Bấm "Xuất bản".
5. API kiểm tra Validation, đổi trạng thái thành `PUBLISHED`, gán `published_at = now()`.
6. (Quan trọng) Backend xóa (Invalidate) Cache của trang Chủ và trang Danh sách Tin Tức trên Redis/Vercel CDN để bài báo xuất hiện ngay lập tức.

## API liên quan
- `GET /api/v1/admin/news`
- `POST /api/v1/admin/news`
- `PUT /api/v1/admin/news/{id}`
- `DELETE /api/v1/admin/news/{id}`
- `POST /api/v1/admin/upload/image` (API tải ảnh nội dung).

## Database liên quan
- Bảng `news`, `categories`, `news_tags`.
- Dữ liệu `content` có thể lưu dưới dạng Markdown hoặc HTML thuần. Khuyến nghị dùng HTML đã qua khử trùng (Sanitized) để dễ render trên Client.

## Responsive
- Màn hình soạn thảo (Editor) tốt nhất nên ép buộc sử dụng trên Tablet hoặc Desktop. Việc viết một bài báo dài kèm định dạng trên Mobile là cực kỳ khó thao tác và không khuyến khích. 

## Security
- **XSS Prevention (Chống mã độc chéo):** Ngay cả khi Admin có quyền, Backend bắt buộc phải chạy bộ lọc (Ví dụ: `bleach` trong Python) qua trường `content` để tước bỏ (strip) mọi thẻ `<script>`, `<iframe>` rác mờ ám, tránh Admin tài khoản bị hack chèn mã đào tiền ảo vào bài viết.

## Logging
- Ghi nhận lịch sử chỉnh sửa (Revision History). Ai đã sửa bài báo, sửa từ nội dung A sang B. 

## Error Handling
- Lỗi trùng Slug (URL đã tồn tại): Frontend gợi ý tự động thêm số hậu tố (Vd: `gia-ca-phe-hom-nay-2`).
- Lỗi kết nối mạng khi Đang soạn thảo: Hiện Toast mờ góc dưới "Mất kết nối. Đang lưu cục bộ...". Dữ liệu tạm thời lưu vào LocalStorage Browser.
