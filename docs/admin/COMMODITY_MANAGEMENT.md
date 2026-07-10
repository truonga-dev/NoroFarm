# Quản lý Danh mục Nông sản (Commodity Management)

## Mục tiêu
Kiểm soát danh sách các mặt hàng nông sản (Cà phê, Tiêu, Sầu riêng, v.v.) được giao dịch và theo dõi trên nền tảng. Module này rất ít khi thay đổi (Thường chỉ setup lúc đầu), nhưng là trung tâm liên kết (Center node) cho mọi dữ liệu về Giá và Tin tức.

## Chức năng
- **Tạo mới Nông sản:** Khai báo một mặt hàng mới để hệ thống bắt đầu thu thập giá.
- **Quản lý Đơn vị (Units):** Cấu hình đơn vị mặc định cho mặt hàng (Ví dụ: `VND/kg`, `VND/tấn`).
- **Hình ảnh nhận diện:** Tải lên Icon hoặc Hình ảnh đại diện (Thumbnail) cho mặt hàng.
- **Mã định danh (Slug):** Định danh duy nhất để phục vụ API và URL.

## Layout
- Giao diện dạng Lưới Thẻ (Card Grid) hoặc Danh sách Bảng đơn giản. Do số lượng nông sản không quá nhiều (Dưới 50 loại), Card Grid kết hợp hình ảnh sẽ trực quan hơn.

## UI / UX
- **UI:** Mỗi Card hiển thị Ảnh Nông sản lớn, Tên, Mã định danh và Trạng thái (Đang theo dõi giá hay Tạm ngưng).
- **UX:** Cho phép "Tắt" (Disable) một nông sản. Khi bị tắt, toàn bộ Widget trên Front-end liên quan đến mặt hàng này tự động ẩn đi mà không cần xóa dữ liệu gốc (Soft Delete).

## Quyền truy cập
- `commodity:manage` (Super Admin, Data Manager).

## Validation
- Tên Nông sản: Không được trùng lặp.
- Mã định danh (ID/Slug): Bắt buộc viết thường, không dấu, ngăn cách bằng gạch dưới hoặc gạch ngang (Vd: `coffee_robusta`).

## Luồng xử lý
1. Admin tạo mặt hàng mới: "Sầu riêng Ri6", ID: `durian_ri6`, Đơn vị: `VND/kg`.
2. Hệ thống tạo Record trong DB.
3. Kể từ giờ phút này, mặt hàng `durian_ri6` sẽ xuất hiện trong menu thả xuống (Dropdown) ở công cụ **Cập nhật Giá (Price Management)** và công cụ lọc Tin tức.

## API liên quan
- `GET /api/v1/admin/commodities`
- `POST /api/v1/admin/commodities`
- `PUT /api/v1/admin/commodities/{id}`
- `PATCH /api/v1/admin/commodities/{id}/status`

## Database liên quan
- Bảng `commodities`. Các bảng khác như `prices` hay `user_favorites` sẽ tham chiếu khóa ngoại đến bảng này.

## Responsive
- Hỗ trợ đầy đủ thiết bị. Card Grid trên Mobile biến thành 1 cột.

## Security
- Ngăn chặn Xóa (Delete) mặt hàng nếu đã có Dữ liệu Giá liên quan. Việc xóa cứng một nông sản sẽ gây lỗi Cascade phá hủy toàn bộ Lịch sử Giá và Sở thích của hàng nghìn người dùng. Thay vào đó, API Delete sẽ trả về lỗi, ép Admin dùng tính năng Deactivate (Tắt ẩn).

## Logging
- Audit Log: `Admin đã thêm loại nông sản mới: Sầu riêng Ri6`.

## Error Handling
- Lỗi khóa ngoại: Nếu vẫn cố gọi lệnh Delete dưới tầng DB, DB sẽ văng lỗi `Foreign Key Constraint Violation`. Tầng Repository bắt lỗi này và ném ra Exception "Không thể xóa do dữ liệu đang được sử dụng ở phân hệ khác".
