# Điều hướng Di động (Mobile Navigation)

Bởi vì người nông dân và thương lái chủ yếu xem giá trên điện thoại di động, UX của Mobile Navigation là yếu tố sống còn của NoroFarm.

## 1. Bottom Navigation Bar (Tùy chọn Khuyến nghị)
Thay vì nhét mọi thứ vào Hamburger Menu ở trên cùng, hãy đặt một thanh cố định ở dưới cùng màn hình (như ứng dụng iOS/Android native).

- **Chiều cao:** `64px`, fixed ở vị trí bottom.
- **Nền:** Kính mờ (Backdrop blur) để tiết kiệm không gian màn hình nhưng vẫn đảm bảo có thể nhìn xuyên thấu khi cuộn. Border trên mảnh `1px`.
- **Items (Tối đa 4-5 mục):**
  - Trang Chủ (Icon Home)
  - Giá Cả (Icon Chart/Trending)
  - Thời Tiết (Icon Sun/Cloud)
  - Tin Tức (Icon Newspaper)
  - Menu / Thêm (Icon Hamburger - Mở ra các trang phụ như Giới thiệu, Liên hệ).
- **Trạng thái Active:** Icon được làm đậm lên (Fill), hoặc đổi sang màu xanh Primary. Text nhãn nhỏ xíu (10-11px) nằm dưới icon.

## 2. Drawer Menu (Menu Cạnh)
Nếu người dùng bấm vào Hamburger (trên Header hoặc Bottom Nav), một Drawer sẽ trượt ra từ bên phải màn hình.
- Độ rộng: `80vw` (chiếm 80% màn hình, chừa lại 20% nền bị mờ đen).
- Bên trong Drawer hiển thị cấu trúc cây (Tree) giống Sitemap để duyệt qua tất cả danh mục nông sản, các trang thông tin.
- Có nút "X" lớn ở góc trên cùng để đóng. Vuốt (Swipe) từ trái qua phải để đóng.
