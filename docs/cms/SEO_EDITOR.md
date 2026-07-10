# Trình Biên tập SEO (SEO Editor Component)

## Mục tiêu
Đây không phải là một trang độc lập, mà là một Component tích hợp vào thanh bên (Sidebar) của mọi Trình soạn thảo (News Editor, Static Page). Nó bắt buộc người viết nội dung phải nghĩ đến SEO trước khi bấm nút Xuất bản.

## Giao diện & Chức năng
- **Bảng điền liệu Meta (Meta Fields):** Gồm 3 ô nhập: Meta Title, Meta Description, Focus Keyword (Từ khóa chính).
- **Xem trước SERP (SERP Preview):** Một ô vuông mô phỏng chính xác giao diện kết quả tìm kiếm của Google (Gồm Tiêu đề xanh, URL, Mô tả). Khi Editor gõ vào bảng điền liệu, ô mô phỏng này cập nhật theo thời gian thực (Real-time).

## Phân tích SEO Thời gian thực (Real-time SEO Analyzer)
Giống như Plugin Yoast SEO của WordPress. CMS sẽ đọc toàn bộ Nội dung bài viết mà Editor đang gõ, đối chiếu với Focus Keyword và chấm điểm (Score).

Hệ thống sẽ hiển thị các Dấu chấm Xanh / Đỏ / Vàng:
- [Đỏ] Từ khóa chính chưa xuất hiện ở thẻ H1.
- [Xanh] Mật độ từ khóa đạt 2.5%.
- [Vàng] Bài báo hơi ngắn (Dưới 300 từ).
- [Đỏ] Meta Title dài quá 60 ký tự, bị cắt cụt.

## Rào cản Kỹ thuật (Publish Blocker)
- Để đảm bảo chất lượng nội dung, CMS có thể cấu hình tính năng chặn (Block): Nếu Bài viết bị đánh dấu ĐỎ (Điểm SEO < 50), nút Xuất bản (Publish) sẽ bị mờ đi (Disabled). Editor phải sửa cho lên đèn Xanh mới được đăng.
