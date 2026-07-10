# Phân quyền & Vai trò (Role & Permissions)

## Mục tiêu
Đảm bảo an ninh hệ thống bằng mô hình Điều khiển truy cập dựa trên Vai trò (RBAC - Role Based Access Control). Quản lý chi tiết đến từng hành động (Xem, Thêm, Sửa, Xóa) trên từng phân hệ.

## Chức năng
- **Quản lý Vai trò (Roles):** Tạo mới, chỉnh sửa, xóa các nhóm Vai trò (Ví dụ: Super Admin, Content Editor, Data Entry, Customer Support).
- **Ma trận Quyền (Permissions Matrix):** Bảng kiểm soát chi tiết gán các Quyền cụ thể cho từng Vai trò.
- **Danh sách Quyền tĩnh (Static Permissions):** Định nghĩa cứng các quyền trong hệ thống (Không cho phép người dùng tự tạo quyền mới, chỉ chọn từ danh sách).

## Layout
- **Màn hình Danh sách Vai trò:** Liệt kê các Role hiện có và số lượng User đang nắm giữ Role đó.
- **Màn hình Cấu hình Role (Edit):** Chia làm 2 phần: 
  - Phần trên: Tên Role, Mô tả.
  - Phần dưới: Bảng Ma Trận Quyền (Dọc là Phân hệ - Vd: Tin tức, Giá cả; Ngang là Hành động - Vd: Create, Read, Update, Delete).

## UI / UX
- **UI:** Ma trận quyền sử dụng các Checkbox lớn, màu xanh để dễ nhận diện. Các Phân hệ được gom nhóm theo Accordion (Thu gọn/Mở rộng).
- **UX:** Hỗ trợ nút "Chọn tất cả" (Select All) cho một Phân hệ để giảm số lần click. Hỗ trợ hiển thị Cảnh báo đỏ nếu Admin định xóa một Role đang có User sử dụng.

## Quyền truy cập
- Cực kỳ nhạy cảm. CHỈ CÓ Vai trò `Super Admin` (Được Hardcode trong hệ thống từ lúc khởi tạo) mới có quyền truy cập vào Module này.
- Quyền hệ thống: `roles:manage`.

## Validation
- Tên Role: Bắt buộc, không quá 50 ký tự, Phải là duy nhất (Unique).
- Không được phép sửa/xóa Role cốt lõi mang tên `Super Admin`.

## Luồng xử lý
1. Super Admin tạo Role mới: "Biên tập viên Tin tức".
2. Tích chọn các quyền: `news:read`, `news:create`, `news:update`, `news:delete`. Không cấp quyền Xóa.
3. Bấm Lưu -> API gửi mảng Permissions về Backend.
4. Backend lưu vào bảng `roles` và `role_permissions`.
5. Khi một User mang Role "Biên tập viên Tin tức" đăng nhập, JWT Token của họ sẽ được nhúng thẳng danh sách Quyền này (hoặc Backend tự lookup Cache) để kiểm duyệt mọi Request tương lai.

## API liên quan
- `GET /api/v1/admin/roles`
- `POST /api/v1/admin/roles`
- `PUT /api/v1/admin/roles/{id}`
- `DELETE /api/v1/admin/roles/{id}`
- `GET /api/v1/admin/permissions` (Lấy danh sách quyền hệ thống gốc).

## Database liên quan
Sử dụng mô hình 3 bảng (Many-to-Many):
- Bảng `roles` (id, name, description).
- Bảng `permissions` (id, key, description) - Chứa các dữ liệu mồi (Seed data) như `news:read`.
- Bảng `role_permissions` (role_id, permission_id).
Lưu ý: Bảng `profiles` của User sẽ chứa trường `role_id` trỏ về Bảng `roles`.

## Responsive
- Bảng Ma trận quyền (Permissions Matrix) rất khó hiển thị trên Mobile. Yêu cầu chuyển giao diện thành các danh sách lồng nhau (Nested List) kèm Switch Toggle khi màn hình thu nhỏ.

## Security
- Chống Leo thang đặc quyền (Privilege Escalation): Khi API Update Role được gọi, Backend phải kiểm tra xem Admin thực hiện hành động này có quyền gán một Permission đặc biệt (Vd: Gán quyền Xóa DB) hay không. Một Admin cấp 2 không thể tự tạo ra một Role cấp 1.
- Bảo mật JWT: Mỗi khi Role bị thay đổi quyền, Backend cần thu hồi toàn bộ Token của tất cả User thuộc Role đó để ép đăng nhập lại nhận Quyền mới.

## Logging
- Audit Log cấp độ cao (CRITICAL): `Super Admin [X] đã thay đổi cấu trúc quyền của Role [Y]. Các quyền thêm: [...], Các quyền bị gỡ: [...]`.

## Error Handling
- Cố xóa Role đang có 100 User sử dụng: API chặn lại trả về mã `400 Bad Request` kèm thông báo Toast: "Không thể xóa Role này. Vui lòng chuyển 100 người dùng sang Role khác trước."
