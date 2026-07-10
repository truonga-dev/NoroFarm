# Quản lý Sao lưu Hệ thống (Backup Management)

## Mục tiêu
Dành cho Super Admin thực hiện và giám sát quá trình sao lưu (Backup) và phục hồi (Restore) dữ liệu từ Giao diện trực quan, thay vì phải dùng dòng lệnh (CLI).

## Chức năng
- **Tạo Sao lưu Thủ công (Manual Backup):** Bấm nút để đóng gói toàn bộ Database và cấu hình tại thời điểm hiện tại.
- **Lịch sử Sao lưu:** Liệt kê các bản Backup tự động (Cronjob) và thủ công.
- **Tải xuống (Download):** Tải file `.sql.gz` về máy cá nhân (Cold Storage) để dự phòng.
- **Phục hồi (Restore - Nguy hiểm):** Ghi đè dữ liệu Production hiện tại bằng một bản Backup cũ.

## Layout
- Giao diện dạng Bảng hiển thị Lịch sử. Nút "Tạo bản sao lưu mới" nằm góc phải trên.

## UI / UX
- **UI:** Nút Phục hồi (Restore) phải màu Đỏ và có biểu tượng Cảnh báo.
- **UX:** Bất kỳ thao tác Phục hồi nào đều yêu cầu:
  1. Gõ chữ `CONFIRM_RESTORE` vào hộp thoại.
  2. Nhập lại mật khẩu Admin hoặc Mã OTP.
  - Quá trình Backup có thể diễn ra lâu (1-5 phút), do đó nút Backup sẽ hiển thị trạng thái Loading và Admin có thể rời trang, hệ thống sẽ gửi Notification khi Backup xong (Background Job).

## Quyền truy cập
- Cấp độ bảo mật cao nhất: `backup:manage`.

## Luồng xử lý
1. Admin bấm "Backup ngay".
2. API gửi lệnh xuống Backend. Backend gọi Background Task (Celery hoặc RQ).
3. Background Task kết nối vào Supabase qua lệnh `pg_dump`.
4. Nén file lại, Upload lên Supabase Storage (Private Bucket).
5. Lưu 1 bản ghi vào bảng `backups_history` với trạng thái `COMPLETED`.
6. Frontend Polling hoặc nghe WebSocket để hiển thị dấu Tick xanh.

## API liên quan
- `POST /api/v1/admin/backup/run`
- `GET /api/v1/admin/backup/history`

## Database liên quan
- Bảng `backups_history`.

## Error Handling
- Lỗi hết dung lượng đĩa ảo khi đang nén file. Hệ thống phải bắt lỗi, hủy lệnh và báo đỏ "Không đủ dung lượng để tạo Backup".
