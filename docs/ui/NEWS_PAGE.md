# Thiết kế: Trang Tin tức

## 1. Mục tiêu
Truyền tải thông tin nông nghiệp một cách dễ đọc, không quảng cáo rác, cấu trúc giống các trang báo cao cấp (Medium, The Verge). Tập trung tối đa vào trải nghiệm đọc.

## 2. Danh sách Tin tức (List View)
- **Bố cục:** Grid 3 cột (`grid-cols-3`). Thẻ bài viết (News Card) gồm:
  - Ảnh Cover (Tỉ lệ 16:9, border-radius `lg`).
  - Badge Danh mục (VD: `Thị trường`).
  - Tiêu đề (Tối đa 2 dòng, `line-clamp-2`).
  - Ngày đăng & Tác giả.
- **Hero Article:** Bài viết mới nhất hoặc quan trọng nhất sẽ được làm nổi bật, chiếm trọn chiều rộng của 2 cột hoặc 3 cột trên cùng.
- **Sidebar:** Có thể thêm thanh bên phải (30% width) để chứa "Tin Đọc Nhiều Nhất" và "Tag Phổ Biến".

## 3. Chi tiết Bài viết (Detail View)
- **Layout:** Căn giữa, chiều rộng hẹp (`max-w-2xl` hoặc `max-w-3xl`) để tối ưu độ dài dòng văn bản (Line length), giúp mắt không bị mỏi khi đọc.
- **Typography:** 
  - Tiêu đề bài viết: H1 rất lớn, font serif hoặc sans-serif đậm.
  - Body Text: `text-lg` (18px), line-height thoáng `leading-relaxed` (1.6 - 1.8).
- **Màu sắc:** Nền trắng tinh (Light Mode) hoặc đen mờ `#111` (Dark Mode). Chữ xám tối (Slate-800) thay vì đen thui.

## 4. Tương tác & Component
- **Thanh Tiến độ Đọc (Reading Progress Bar):** Một thanh màu Primary mảnh (2px) ở đỉnh màn hình, chạy từ trái sang phải tương ứng với việc cuộn trang.
- **Nút Chia sẻ:** Fixed ở cạnh trái màn hình (hoặc bottom bar trên mobile).
- **Hình ảnh trong bài:** Bấm vào sẽ mở rộng ra (Lightbox / Zoom in).
