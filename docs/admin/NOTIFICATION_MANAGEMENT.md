# Quản lý Thông báo (Notification Management)

## Mục tiêu
Công cụ truyền thông nội bộ và chăm sóc khách hàng (Engage users). Cho phép Marketing/Admin gửi thông báo đẩy (Push Notification) hoặc thông báo trong ứng dụng (In-app Bell) đến toàn bộ hệ thống hoặc từng nhóm Nông dân cụ thể.

## Chức năng
- **Gửi thông báo mới:** Gửi ngay lập tức hoặc hẹn giờ.
- **Targeting (Nhắm mục tiêu):** Gửi cho "Tất cả mọi người", "Chỉ những người ghim Đắk Lắk", hoặc "Chỉ những người ghim Cà phê".
- **Lịch sử gửi:** Báo cáo tỷ lệ gửi thành công, tỷ lệ mở (Open Rate).

## Layout
- Form soạn thảo thông báo gồm Tiêu đề, Nội dung ngắn, Hình ảnh (Tùy chọn), Link đính kèm (Deep link).

## UI / UX
- **UX:** Có màn hình giả lập (Mockup Mobile Screen) để Admin xem trước Thông báo sẽ hiện lên điện thoại Nông dân trông như thế nào trước khi bấm Gửi.

## Quyền truy cập
- `notification:manage` (Marketing, Editor).

## Luồng xử lý
1. Admin chọn nhóm "Người theo dõi Hồ Tiêu" (VD: 5,000 người).
2. Soạn thông báo "Giá Tiêu tăng đột biến". Bấm Gửi.
3. Backend (FastAPI) nhận lệnh. Vì đẩy 5,000 cái cùng lúc có thể làm sập DB, Backend đưa nhiệm vụ vào Hàng đợi (Message Queue - RabbitMQ/Redis).
4. Các Worker chạy ngầm bốc dần thông báo ra và bắn vào cột `notifications` của 5,000 users đó, đồng thời kích hoạt WebSocket / Firebase Cloud Messaging để Push Notification nổi lên màn hình điện thoại.

## API liên quan
- `POST /api/v1/admin/notifications/broadcast`
