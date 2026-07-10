# Cài đặt Hệ thống (System Settings)

## Mục tiêu
Trái tim điều khiển cấu hình của NoroFarm. Nơi chứa các công tắc (Feature Flags) và Cài đặt lõi của Website.

## Chức năng
- **Bảo trì (Maintenance Mode):** Công tắc (Toggle) Đóng website để bảo trì. Khi bật, toàn bộ User truy cập Web sẽ thấy trang "Bảo trì", chỉ Admin có quyền mới vào được.
- **Cấu hình Caching:** Tắt/Bật bộ đệm Redis toàn cầu. Dọn dẹp Cache thủ công (Clear Cache) khi cần làm mới dữ liệu khẩn cấp.
- **Mạng xã hội:** Nhập link Facebook, Tiktok, Zalo OA của công ty (Để hiển thị dưới Footer).
- **Thông tin Liên hệ:** Địa chỉ công ty, Hotline, Email hiển thị ngoài trang Public.
- **Tích hợp bên thứ 3 (Integrations):** Nhập Google Analytics ID, Facebook Pixel ID.

## Layout
- Giao diện Settings tiêu chuẩn giống MacOS/iOS. Một cột danh sách Menu Setting bên trái (Chung, Bảo trì, Mạng xã hội, Tích hợp). Bên phải là Form tương ứng.

## UI / UX
- **UI:** Form rõ ràng. Tính năng nguy hiểm (Ví dụ: Xóa toàn bộ Cache) nằm trong khung màu đỏ (Danger Zone).
- **UX:** Các thay đổi sẽ được Auto-save khi người dùng rời khỏi ô Input (On Blur) kèm theo icon Loading nhỏ, thay vì phải kéo xuống dưới cùng để bấm nút "Lưu thay đổi".

## Quyền truy cập
- Cực kỳ nhạy cảm. Yêu cầu `settings:manage` (Chỉ Super Admin).

## Validation
- Các đường link (Facebook, Zalo) phải đúng chuẩn URL hợp lệ (Phải có `https://`).
- Email Hotline phải đúng chuẩn Email.

## Luồng xử lý (Bật chế độ bảo trì)
1. Super Admin gạt công tắc Maintenance Mode sang "ON".
2. Bấm Lưu.
3. Backend cập nhật Flag `maintenance_mode = true` vào Redis (Vì Redis đọc rất nhanh).
4. Middleware của Next.js (hoặc FastAPI) ở mọi Request sau đó sẽ đọc cờ này. Nếu là "ON" và Request không có JWT của Admin, lập tức chặn đứng và trả về màn hình HTML 503 Maintenance. Ngược lại cho qua.

## API liên quan
- `GET /api/v1/admin/settings`
- `PUT /api/v1/admin/settings`
- `POST /api/v1/admin/settings/clear-cache`

## Database liên quan
- Bảng `system_settings`. Cấu trúc dạng `key` - `value` (Value có thể là JSONB để lưu cấu hình phức tạp).

## Responsive
- Hoạt động tốt trên Mobile để Admin có thể xử lý sự cố (Bật bảo trì, xóa Cache) từ xa bằng điện thoại khi đang không có máy tính.

## Security
- Toàn bộ hành động trong khu vực này phải được yêu cầu Xác thực Bước 2 (MFA / 2FA) hoặc Yêu cầu gõ lại Mật khẩu. Chống trường hợp Admin quên khóa máy, người khác vào phá hệ thống.
