# Quản lý Phiên bản (Versioning & Revision History)

## Mục tiêu
Tính năng "Cứu rỗi" (Lifesaver) cho Biên tập viên. Tránh tình trạng Editor lỡ tay xóa mất một đoạn văn quan trọng, lưu nháp đè lên, và không thể lấy lại được nội dung cũ. Giống như tính năng Version History của Google Docs.

## Giao diện Lịch sử Phiên bản
- Cột bên phải (Sidebar) của CMS hiển thị nút "Xem Lịch sử Phiên bản".
- Bấm vào sẽ liệt kê danh sách các bản lưu tự động (Ví dụ: `Lưu tự động lúc 14:05`, `Lưu tự động lúc 13:30`).

## Chế độ So sánh (Diff Viewer)
- Khi Editor chọn 1 phiên bản cũ, CMS sẽ hiển thị giao diện chia đôi (Split-view).
- Bên trái là Bản cũ, Bên phải là Bản hiện tại.
- Các chữ bị Xóa sẽ được bôi nền Đỏ gạch ngang, các chữ được Thêm mới bôi nền Xanh lá (Giống y hệt giao diện GitHub PR).

## Phục hồi (Restore)
- Nếu Editor thấy Bản 13:30 là bản đúng nhất, họ có thể bấm nút "Phục hồi về bản này".
- CMS sẽ lấy nội dung bản 13:30 đè lên Editor hiện tại (Nhưng chưa lưu thẳng vào DB, chỉ để Editor tiếp tục làm việc).

## Cơ chế Database (Dành cho Developer)
- Không ghi đè thẳng vào cột `content` của bảng `news` mỗi khi Auto-save.
- Tạo một bảng phụ `news_revisions` (news_id, content, created_at).
- Để tránh rác DB, cấu hình Backend chỉ giữ lại tối đa 10 phiên bản gần nhất (Retention Policy) cho một bài viết.
