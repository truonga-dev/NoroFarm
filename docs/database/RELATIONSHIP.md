# Relationships (Các Mối quan hệ)

## 1. Profiles & Supabase Auth (1 : 1)
- **Mô tả:** Hệ thống Supabase giữ thông tin nhạy cảm (Mật khẩu hash, Email/SĐT đăng nhập) ở bảng nội bộ `auth.users`. Bảng `public.profiles` chứa thông tin hiển thị (Tên, Avatar).
- **Ràng buộc (Constraint):** `profiles.id` phải có Khóa ngoại (Foreign Key) trỏ về `auth.users.id` với thuộc tính `ON DELETE CASCADE` (Xóa user thì profile biến mất).

## 2. Commodities & Prices (1 : N)
- **Mô tả:** Một mặt hàng nông sản sẽ có hàng vạn bản ghi giá cả (theo từng ngày, từng vùng).
- **Khóa ngoại:** `prices.commodity_id` -> `commodities.id`.

## 3. Regions & Prices (1 : N)
- **Mô tả:** Một Tỉnh thành có nhiều bản ghi giá cả.
- **Khóa ngoại:** `prices.region_id` -> `regions.id`.

## 4. Regions & Regions (Self-Referencing 1 : N)
- **Mô tả:** Ràng buộc nội bộ (Self-join). Một Tỉnh có nhiều Huyện.
- **Khóa ngoại:** `regions.parent_id` -> `regions.id`. Nếu `parent_id` là null, đó là cấp Tỉnh.

## 5. Users & User_Favorites (1 : N)
- **Mô tả:** Một người dùng có thể ghim nhiều nông sản hoặc nhiều tỉnh thành.
- **Khóa ngoại:** `user_favorites.user_id` -> `profiles.id` (`ON DELETE CASCADE`).

## 6. Mối quan hệ Đa hình (Polymorphic) của User_Favorites
- Cột `entity_type` và `entity_id` đóng vai trò là một khóa ngoại lỏng (Loose foreign key). 
- Do `entity_id` có thể trỏ về `commodities.id` hoặc `regions.id` tùy theo `entity_type`, SQL không hỗ trợ Khóa ngoại đa hình tự nhiên. Ràng buộc này sẽ được quản lý bằng Application Logic (FastAPI) hoặc dùng Trigger kiểm tra chéo trước khi Insert.
