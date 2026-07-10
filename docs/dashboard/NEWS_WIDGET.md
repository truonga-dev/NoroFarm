# News Widget (Tin Tức Nổi Bật)

## 1. Mục đích
Hiển thị 3-5 bài báo / thông báo thị trường mới nhất được hệ thống tự động lọc phù hợp với mặt hàng người dùng đang quan tâm.

## 2. Layout & Bố cục
- Dạng danh sách vuốt dọc (Vertical Feed) trong một Card có thanh cuộn nội bộ (Internal Scrollbar) nếu quá dài.
- Mỗi bài viết (Item) gồm: Ảnh thumbnail vuông nhỏ bên trái, Tiêu đề và Thời gian bên phải.

## 3. Grid & Responsive
- **Desktop (Chiếm 6 cột):** Nằm nửa bên trái ở hàng dưới. Hiển thị đủ 4 tin tức dạng dòng.
- **Tablet (Chiếm 12 cột):** Chia làm 2 cột dọc (Mỗi bên 2 tin tức).
- **Mobile:** Rút gọn chỉ hiện 2 tin mới nhất, và một nút "Xem tất cả" (View all) thật to bên dưới.

## 4. Animation & Trạng thái
- **Animation:** Hover vào một dòng tin, dòng đó đổi nền xám nhạt `bg-slate-50`, Thumbnail scale nhẹ 105%.
- **Loading / Skeleton:** Các khối vuông nhỏ cạnh các khối chữ nhật dài. 
- **Error:** Cảnh báo mờ: "Không tải được tin tức lúc này."
- **Empty:** Cực kỳ hiếm xảy ra. Nếu có: "Hiện chưa có tin nóng nào hôm nay."
