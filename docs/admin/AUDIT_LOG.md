# Nhật ký Hoạt động (Audit Logs)

## Mục tiêu
Bảo đảm tính Khả vết (Traceability) và Tuân thủ (Compliance). Khác với Log Kỹ thuật (App Logs), Audit Logs tập trung vào HÀNH VI CỦA CON NGƯỜI (Nhân viên quản trị). Nó trả lời cho câu hỏi: "Ai đã xóa bài viết này lúc 3h sáng?".

## Chức năng
- **Bảng ghi vết (Audit Trail):** Ghi nhận 100% các thao tác Thêm (Create), Sửa (Update), Xóa (Delete) thực hiện bởi những người dùng có Role Admin/Editor.
- **Theo dõi Phiên làm việc (Session Tracking):** Ghi nhận Địa chỉ IP, Trình duyệt (User-Agent) và Thời gian đăng nhập của các Admin.
- **Xuất báo cáo (Export):** Tải file CSV/Excel lịch sử hoạt động để giải trình khi có sự cố nội bộ.

## Layout
- Giao diện Bảng dữ liệu tĩnh (Data Table). Không có chức năng Xóa (Xóa log là hành vi vi phạm bảo mật).

## UI / UX
- **UI:** Bảng gồm các cột: `Thời gian`, `Người thực hiện` (Avatar + Tên), `Hành động` (Badge: Thêm/Sửa/Xóa/Đăng nhập), `Mục tiêu` (Tên bài viết, Tên User bị khóa), `Địa chỉ IP`.
- **UX:** Bấm vào một dòng log sẽ mở chi tiết (Modal) xem "Dữ liệu trước khi sửa" (Before) và "Dữ liệu sau khi sửa" (After) dưới dạng Code Diff (Xanh/Đỏ) để xem Admin đó đã sửa chữ gì.

## Quyền truy cập
- `audit:read` (Super Admin, Internal Auditor).
- ĐẶC BIỆT: Không ai, kể cả Super Admin, có quyền XÓA Audit Logs.

## Validation
- Các truy vấn xuất báo cáo cần có giới hạn khoảng thời gian (Tối đa 30 ngày/lần) để tránh sập máy chủ.

## Luồng xử lý (Code Diff Capture)
1. BTV A sửa giá Cà phê từ `110,000` thành `115,000`.
2. Backend nhận Request UPDATE.
3. Trước khi ghi vào DB, Backend lấy dữ liệu cũ của Dòng đó.
4. Update dữ liệu mới.
5. Ghi 1 bản ghi vào bảng `audit_logs` với nội dung: 
   `action="UPDATE", target="prices", old_value={"price": 110000}, new_value={"price": 115000}`.
6. Màn hình Audit Log Frontend sẽ parse JSON này và vẽ ra 2 cột so sánh Before/After.

## API liên quan
- `GET /api/v1/admin/audit-logs`
- `GET /api/v1/admin/audit-logs/export`

## Database liên quan
- Bảng `audit_logs` (Nằm trong Postgres).
- Vì bảng này sẽ phình to không giới hạn, cần thiết lập kỹ thuật Partitioning (Cắt rãnh theo tháng) trên PostgreSQL để đảm bảo tốc độ Query không bị chậm sau 1 năm hoạt động.

## Responsive
- Hỗ trợ tốt trên Desktop và Tablet. Mobile chỉ hiển thị dạng Tóm tắt (Ai vừa làm gì).

## Security
- Bảng `audit_logs` trong DB phải bị khóa chặt ở tầng DB (Bằng Trigger PostgreSQL: Cấm `DELETE` hoặc `TRUNCATE` bảng này bởi bất kỳ User nào, kể cả postgres admin, để ngăn chặn nhân viên kỹ thuật xóa dấu vết sau khi phá hoại). 
- Chỉ cấp quyền `INSERT` và `SELECT`.
