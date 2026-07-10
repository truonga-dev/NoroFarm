# Trình biên tập Danh mục (Category Editor)

## Mục tiêu
Công cụ để cấu trúc và sắp xếp lại Menu / Chuyên mục của hệ thống. 

## Giao diện Thao tác
- Giao diện dạng Cây (Tree View) ở bên trái và Form chỉnh sửa (Detail Form) ở bên phải.
- **Kéo và Thả (Drag & Drop):** Yếu tố quan trọng nhất. Admin có thể kéo 1 danh mục, thả vào bên trong 1 danh mục khác để biến nó thành Danh mục con (Sub-category). 
- Khi kéo thả, UI phải có một đường kẻ ngang (Drop indicator) báo hiệu vị trí sẽ thả vào.

## Thuộc tính Danh mục (Properties)
Khi chọn 1 Danh mục, Form bên phải cho phép sửa:
- **Tên Danh mục:** Ví dụ "Kiến thức Nông nghiệp".
- **Slug (Đường dẫn):** Tự động sinh ra từ Tên (Vd: `kien-thuc-nong-nghiep`), nhưng cho phép Admin sửa tay nếu muốn ngắn hơn.
- **Ảnh đại diện (Thumbnail):** Dùng để hiển thị ngoài giao diện Trang chủ nếu thiết kế có yêu cầu Box Danh mục.
- **Màu sắc (Color Tag):** Chọn màu đại diện cho danh mục (Ví dụ: Cà phê màu Nâu, Phân bón màu Xanh lá). Các bài viết thuộc danh mục này sẽ có cái Nhãn (Badge) mang màu tương ứng.

## Cảnh báo Xóa (Delete Safeguard)
- Không cho phép xóa Danh mục đang có chứa bài viết.
- Khi bấm Xóa, CMS bật Modal hỏi: "Danh mục này đang chứa 15 Bài viết. Bạn muốn XÓA LUN các bài viết đó, hay CHUYỂN chúng sang Danh mục khác (Vd: Uncategorized)?".
