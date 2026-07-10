# Quản lý Người dùng (User Management)

## Mục tiêu
Cung cấp công cụ quản lý toàn bộ vòng đời của người dùng trên nền tảng (Bao gồm cả Khách hàng và Nhân viên Admin). Hỗ trợ tìm kiếm, khóa tài khoản, phân quyền nhanh và xem lịch sử hoạt động cá nhân.

## Chức năng
- **Danh sách (List):** Liệt kê toàn bộ người dùng có phân trang.
- **Tìm kiếm (Search & Filter):** Tìm theo Tên, Số điện thoại, Trạng thái (Active/Banned), Ngày đăng ký, Vai trò (Role).
- **Chi tiết (Detail):** Xem hồ sơ người dùng, các Nông sản họ đang ghim, Lịch sử tương tác.
- **Hành động (Actions):** 
  - Khóa/Mở khóa tài khoản (Ban/Unban).
  - Đặt lại mật khẩu (Force Password Reset).
  - Gán Vai trò (Assign Role) cho nhân viên quản trị.

## Layout
- **Header:** Tiêu đề trang + Thanh tìm kiếm lớn + Nút Lọc (Filter) + Nút "Thêm User mới" (Dành cho Admin nội bộ).
- **Body:** Bảng dữ liệu (Data Table). Hỗ trợ sắp xếp (Sort) theo các cột.
- **Modal/Drawer:** Bấm vào dòng dữ liệu sẽ mở ra Modal hoặc Drawer trượt từ bên phải chứa Thông tin chi tiết của người dùng.

## UI / UX
- **UI:** Bảng dữ liệu sử dụng thiết kế tinh gọn, có Avatar nhỏ bên cạnh Tên. Trạng thái hiển thị bằng Badge (Xanh = Hoạt động, Đỏ = Đã khóa).
- **UX:** Hỗ trợ Thao tác hàng loạt (Bulk Actions) bằng Checkbox. Nếu bấm "Khóa tài khoản", phải hiển thị Dialog xác nhận cực kỳ nguy hiểm (Destructive Alert) yêu cầu điền lý do khóa.

## Quyền truy cập
- Yêu cầu quyền: `users:read` (Xem), `users:update` (Chỉnh sửa/Khóa), `users:create` (Tạo mới).
- LƯU Ý: Super Admin không thể bị Khóa bởi một Admin khác. Không ai có quyền tự thay đổi Role của chính mình.

## Validation
- Form tạo Admin mới: SĐT phải đúng định dạng VN (Regex `/(84|0[3|5|7|8|9])+([0-9]{8})\b/`). Mật khẩu mạnh.
- Lý do khóa tài khoản: Không được để trống, độ dài tối đa 255 ký tự.

## Luồng xử lý
1. (Thao tác Khóa User): Admin bấm nút Khóa -> Chọn lý do -> Xác nhận.
2. Frontend gọi API Update Status.
3. Backend cập nhật trường `status` trong DB thành `BANNED`. Đồng thời Vô hiệu hóa toàn bộ Refresh Token của User này trong Redis để ép buộc họ văng khỏi ứng dụng ngay lập tức (Force Logout).
4. Ghi Audit Log.
5. Trả về Frontend thông báo Toast: "Đã khóa thành công".

## API liên quan
- `GET /api/v1/admin/users` (Lấy danh sách, hỗ trợ tham số `?q=&role=&page=`).
- `GET /api/v1/admin/users/{id}` (Lấy chi tiết).
- `PATCH /api/v1/admin/users/{id}/status` (Khóa/Mở khóa).
- `PUT /api/v1/admin/users/{id}/role` (Gán quyền).

## Database liên quan
- Bảng: `public.profiles`, `auth.users` (Supabase).
- Khi thay đổi Trạng thái, phải cập nhật siêu dữ liệu (Metadata) bên trong `auth.users` để Supabase từ chối cấp Token mới cho tài khoản bị khóa.

## Responsive
- **Desktop:** Bảng hiển thị đầy đủ 7-8 cột.
- **Tablet/Mobile:** Chuyển bảng Data Table thành dạng Danh sách Thẻ (Card List). Mỗi Card chứa thông tin 1 User để dễ bấm bằng ngón tay. Các nút thao tác chuyển vào Menu ba chấm (Dropdown).

## Security
- Dữ liệu trả về KHÔNG BAO GIỜ được chứa Mật khẩu băm (Password Hash) hay Salt. 
- Chống lại IDOR (Insecure Direct Object Reference): Backend phải luôn kiểm tra xem Admin có quyền can thiệp vào ID User được truyền lên hay không (Admin cấp thấp không được can thiệp ID của Admin cấp cao).

## Logging
- Bắt buộc ghi log chi tiết khi có bất kỳ thay đổi Trạng thái hoặc Cấp quyền nào. (Vd: `Admin [A] đã nâng cấp User [B] lên quyền [Editor]`).

## Error Handling
- Lỗi trùng Số điện thoại khi tạo mới: Trả về Toast "Số điện thoại đã tồn tại trong hệ thống".
- Cố tình Khóa tài khoản Super Admin: Trả về lỗi 403 "Bạn không có quyền thao tác trên tài khoản này".
