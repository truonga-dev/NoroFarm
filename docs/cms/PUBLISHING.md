# Quản lý Xuất bản (Publishing & Scheduling)

## Mục tiêu
Cung cấp sự linh hoạt trong việc quyết định THỜI ĐIỂM đưa nội dung ra công chúng. 

## Trạng thái Vòng đời (Status Lifecycle)
Bất kỳ nội dung nào trong CMS cũng phải có thuộc tính `status`:
- `DRAFT`: Bản nháp, chỉ người viết và người duyệt mới thấy trong CMS.
- `PENDING`: Đang chờ duyệt. (Dùng cho quy trình Workflow nhiều bước).
- `SCHEDULED`: Đã lên lịch, chờ hệ thống tự động xuất bản vào ngày giờ tương lai.
- `PUBLISHED`: Đã hiển thị ra công chúng (Công khai).
- `ARCHIVED`: Đã cất vào kho lưu trữ (Không còn hiển thị ra ngoài, nhưng dữ liệu vẫn còn trong CMS).

## Chức năng Lên lịch (Scheduling)
- Thay vì bấm nút "Xuất bản ngay", Editor có thể chọn "Lên lịch" (Schedule) và dùng Date Picker chọn một ngày giờ trong tương lai (Ví dụ: 08:00 AM sáng mai).
- Trạng thái bài viết chuyển sang `SCHEDULED`.
- **Cơ chế Backend:** Một Cronjob (chạy ngầm mỗi phút một lần) sẽ quét DB. Nếu thấy bài báo nào có Trạng thái `SCHEDULED` và `published_at <= now()`, nó sẽ tự động đổi Trạng thái thành `PUBLISHED` và gọi lệnh Xóa Cache Next.js (Revalidation).

## Đăng lại & Cập nhật (Republish & Update)
- Khi bài viết đã `PUBLISHED`, nếu Editor vào sửa chữ và bấm Lưu, nút "Xuất bản" sẽ đổi tên thành "Cập nhật" (Update). 
- Ngày giờ `published_at` không thay đổi, nhưng ngày `updated_at` sẽ thay đổi.
