# Quy ước Đặt tên (Naming Convention)

## Mục tiêu
Định nghĩa hệ thống ngôn ngữ chung (Ubiquitous Language) thống nhất trên toàn bộ Frontend, Backend và Database.

## 1. Quy ước Chung (General Rules)
- **Ngôn ngữ:** 100% tên biến, tên hàm, tên file BẮT BUỘC viết bằng Tiếng Anh. Không dùng Tiếng Việt không dấu (VD: Không dùng `gia_ca_phe`, phải dùng `coffee_price`).
- **Ý nghĩa (Meaningful):** Tên phải mô tả chính xác mục đích. CẤM dùng các biến tối nghĩa như `data`, `item`, `val`, `temp`. Hãy dùng `coffeePricesData`, `userProfileItem`.
- **Số nhiều (Pluralization):** Một mảng (Array) hoặc Danh sách (List) phải để ở dạng số nhiều (Ví dụ: `users`, `prices`) hoặc có hậu tố `List` (Ví dụ: `userList`).

## 2. Tiêu chuẩn Frontend (TypeScript/React)
- **Files & Folders:**
  - Component Files: `PascalCase` (VD: `CoffeePriceTable.tsx`).
  - Helper/Util Files: `camelCase` (VD: `formatCurrency.ts`).
  - Constants Files: `UPPER_SNAKE_CASE` (VD: `APP_CONFIG.ts`).
- **Variables & Functions:** `camelCase` (VD: `fetchUserData`, `isModalOpen`).
- **Interfaces & Types:** `PascalCase`. (Lưu ý: Không dùng tiền tố `I` cho Interface. Dùng `UserProfile` thay vì `IUserProfile`).
- **Boolean Variables:** Bắt buộc bắt đầu bằng `is`, `has`, `should`, `can` (VD: `isLoading`, `hasError`).

## 3. Tiêu chuẩn Backend (Python/FastAPI)
- **Files & Folders:** `snake_case` (VD: `user_service.py`, `database_config.py`).
- **Variables & Functions:** `snake_case` (VD: `get_active_users()`, `coffee_price`).
- **Classes & Models:** `PascalCase` (VD: `UserModel`, `PriceService`).
- **Constants:** `UPPER_SNAKE_CASE` (VD: `MAX_RETRY_COUNT`).

## 4. Tiêu chuẩn Database (PostgreSQL)
- **Tables & Columns:** `snake_case` và ở dạng SỐ ÍT (Singular). (VD: Bảng `user` thay vì `users`, Cột `created_at`, `first_name`).
- **Primary Keys:** Luôn đặt tên là `id` (Kiểu UUID hoặc BigInt Auto-increment).
- **Foreign Keys:** Định dạng `[table_name]_id` (VD: `user_id`, `category_id`).
