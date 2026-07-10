# Hệ thống Quản trị Nội dung (Admin CMS)

## Mục tiêu
Cung cấp một nền tảng quản trị (Back-office) chuẩn Enterprise dành riêng cho Ban Quản trị (Super Admin, Editor, Moderator) của NoroFarm. Hệ thống cho phép kiểm soát toàn diện mọi khía cạnh từ Dữ liệu, Người dùng, Bài viết cho đến Cấu hình Hệ thống, đảm bảo tính ổn định và tính toàn vẹn dữ liệu cho nền tảng Front-office.

## Chức năng cốt lõi
Hệ thống Admin được chia thành các phân hệ chính:
1. **Dashboard:** Tổng quan số liệu thống kê hệ thống (Lưu lượng, Người dùng mới, Cảnh báo lỗi).
2. **Quản lý Dữ liệu Nông nghiệp:** Giá cà phê, Nông sản, Thời tiết, Xu hướng thị trường.
3. **Quản lý Nội dung (CMS):** Tin tức, Media, Danh mục, FAQ, Trình tạo trang (Page Builder).
4. **Quản lý Người dùng (IAM):** Users, Roles & Permissions.
5. **Vận hành & Hệ thống (Ops):** SEO, Cài đặt chung, Logs, Audit Logs, Backup.
6. **Tương tác Khách hàng:** Quản lý Liên hệ (Contact), Thông báo (Notification).

## Tiêu chuẩn Thiết kế & Vận hành (Enterprise Standards)
- **Bảo mật tối đa (Zero-Trust):** Không có route nào truy cập được nếu thiếu JWT hợp lệ và quyền hạn (Permission) cụ thể.
- **Tính khả vết (Traceability):** Mọi hành động Create/Update/Delete (CUD) đều phải được lưu vết trong `Audit Log` (Ai làm gì, vào lúc nào, địa chỉ IP nào).
- **Phản hồi tức thì (Optimistic UI):** Tối ưu hóa UX để Admin thao tác nhanh chóng, tránh phải chờ đợi màn hình loading quá lâu.
- **An toàn Dữ liệu (Data Safety):** Khuyến khích sử dụng "Soft Delete" (Xóa mềm) thay vì "Hard Delete" để có thể khôi phục dữ liệu nếu Admin lỡ tay thao tác sai.

## Tổ chức Tài liệu
Các tài liệu trong thư mục này đi sâu vào phân tích đặc tả kỹ thuật và thiết kế cho từng Phân hệ (Module) cấu thành nên Admin CMS.
