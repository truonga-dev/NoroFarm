# Luồng phê duyệt (Approval Workflow)

## Mục tiêu
Dành cho môi trường Tòa soạn lớn. Đảm bảo chất lượng bài viết và ngăn chặn các thông tin sai lệch về giá nông sản (Có thể gây hoang mang thị trường) bị xuất bản khi chưa được kiểm chứng.

## Luồng 2 Cấp (2-Tier Workflow)
NoroFarm áp dụng luồng phê duyệt cơ bản gồm 2 vai trò: Người Viết (Contributor) và Người Duyệt (Editor/Manager).

### Bước 1: Khởi tạo
- Contributor viết bài, dán ảnh. Nút "Xuất bản" của họ bị ẨN. Thay vào đó là nút **"Gửi chờ duyệt"** (Submit for Review).
- Bài viết chuyển sang trạng thái `PENDING`.

### Bước 2: Nhắc nhở (Notification)
- CMS gửi một Thông báo (In-app Notification hoặc Email) đến các tài khoản mang Role Manager: "Có bài báo mới: [Tên bài báo] đang chờ duyệt".

### Bước 3: Đánh giá (Review)
- Manager mở bài viết. CMS ở chế độ Chỉ-đọc (Read-only) kèm theo chức năng Ghi chú (Comments).
- Trải nghiệm Review: Tương tự Google Docs, Manager có thể bôi đen một đoạn chữ và viết Ghi chú: "Số liệu giá cà phê này sai, hãy kiểm tra lại nguồn".
- Cuối bài, Manager có 2 nút:
  - **Yêu cầu sửa đổi (Request Changes):** Bài viết quay về Trạng thái `DRAFT`, đẩy ngược lại cho Contributor.
  - **Duyệt & Xuất bản (Approve & Publish):** Bài viết chuyển sang `PUBLISHED`.

## Nhật ký Phê duyệt (Approval Log)
Mọi lịch sử Đưa lên duyệt -> Trả về -> Sửa đổi -> Duyệt thành công đều được ghi lại trong tab "Lịch sử Phê duyệt" đính kèm bên trong form chi tiết bài viết, giúp theo dõi trách nhiệm rõ ràng (Accountability).
