# Quản lý Câu hỏi thường gặp (FAQ Management)

## Mục tiêu
Cung cấp nội dung cho trang Trợ giúp / Hướng dẫn sử dụng của NoroFarm. Giúp giảm tải cho bộ phận Chăm sóc khách hàng.

## Chức năng
- **Quản lý Topic (Chủ đề):** Vd: "Hướng dẫn xem biểu đồ", "Lỗi tài khoản".
- **Quản lý Q&A:** Thêm Cặp Câu hỏi (Question) - Trả lời (Answer).

## Layout
- Dạng danh sách có thể mở rộng (Accordion).

## UI / UX
- **UX:** Cho phép Kéo thả (Drag & Drop) để sắp xếp lại thứ tự Câu hỏi nào hiển thị lên trên cùng (Ưu tiên câu hỏi nhiều người quan tâm).

## Quyền truy cập
- `content:manage` (Editor, CS).

## Database liên quan
- Bảng `faqs` (id, topic_id, question, answer, sort_order).
