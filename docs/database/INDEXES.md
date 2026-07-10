# Database Indexes (Chỉ mục Tối ưu Tốc độ)

Với đặc thù của NoroFarm, tốc độ lấy ra Giá mới nhất và Vẽ biểu đồ lịch sử giá là sống còn.

## 1. Bảng `prices` (Bảng cực nặng)
Để lấy giá nhanh nhất cho một mặt hàng tại một tỉnh, hoặc vẽ biểu đồ, ta phải scan bảng `prices` rất nhanh.
- **Index 1: B-Tree 복합 (Composite Index):** `(commodity_id, region_id, valid_from DESC)`.
  - Hỗ trợ câu truy vấn: "Tìm giá Cà phê ở Đắk Lắk ngày mới nhất".
- **Index 2: BRIN (Block Range Index):** Khuyên dùng cho cột `valid_from` nếu bảng có dung lượng cực lớn (Hàng chục GB), vì dữ liệu giá luôn được Insert theo thứ tự thời gian, BRIN tốn ít dung lượng hơn B-Tree.

## 2. Bảng `news`
- **Index 1: B-Tree trên `slug`:** Hỗ trợ Frontend lấy bài viết qua URL (`/tin-tuc/gia-ca-phe-hom-nay`). Bắt buộc.
- **Index 2: B-Tree trên `published_at DESC`:** Hỗ trợ load danh sách feed tin tức mới nhất nhanh chóng.
- **Index 3: GiST/GIN (Full-Text Search Index) trên `title` và `content`:** Hỗ trợ Search API tìm kiếm bài viết tốc độ cực cao với cú pháp tìm kiếm `tsvector`.

## 3. Bảng `user_favorites`
- **Index: Composite B-Tree:** `(user_id, entity_type, entity_id)`. Giúp hệ thống lập tức load được danh sách ghim của User khi họ mở Dashboard mà không cần scan toàn bộ bảng. Thêm ràng buộc `UNIQUE` trên bộ 3 cột này để ngăn chặn ghim trùng lặp.

## 4. Bảng `profiles`
- **Index: B-Tree trên `phone_number`:** Hỗ trợ tìm kiếm nhanh User qua SĐT. (Dù SĐT đã unique, nhưng khai báo tường minh để Admin search).

## Lưu ý về Index
- Không lạm dụng Index trên các cột có giá trị lặp lại cao (Độ chọn lọc - Selectivity thấp) như `is_active` vì sẽ làm chậm tốc độ `INSERT/UPDATE` mà không tăng tốc `SELECT` bao nhiêu.
