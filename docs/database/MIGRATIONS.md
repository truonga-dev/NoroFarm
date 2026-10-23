# Hướng Dẫn Migration (Migrations Guide)

Dự án NoroFarm sử dụng Supabase Local Development để quản lý database migrations.

## 1. Cấu trúc Thư Mục
Mọi file migration nằm trong thư mục `supabase/migrations/` với định dạng tên:
`YYYYMMDDHHMMSS_description.sql`

Ví dụ: `20260710000000_initial_schema.sql`

## 2. Các Lệnh Migration Cơ Bản
(Yêu cầu đã cài đặt Supabase CLI)

- **Tạo một migration trống mới:**
  ```bash
  supabase migration new your_migration_name
  ```

- **Tạo migration từ những thay đổi local (auto-generate):**
  ```bash
  supabase db diff -f your_migration_name
  ```

- **Áp dụng toàn bộ migration lên Local DB:**
  ```bash
  supabase db reset
  ```
  *(Lưu ý: Lệnh này sẽ xóa toàn bộ data local và chạy lại từ đầu tất cả migrations + seed file)*

- **Đẩy migration lên Supabase Production:**
  ```bash
  supabase db push
  ```

## 3. Best Practices khi viết SQL Migration
1. **Idempotent (Tính lũy đẳng):** Luôn sử dụng `IF NOT EXISTS` khi tạo bảng hoặc index, tránh việc migration bị crash do object đã tồn tại.
2. **Không thay đổi migration cũ:** Nếu bạn cần sửa một bảng đã tạo ở migration trước, hãy tạo một migration mới với câu lệnh `ALTER TABLE` thay vì sửa vào file SQL cũ.
3. **Transaction:** Supabase CLI mặc định chạy mỗi file trong một Transaction, nên nếu có lỗi ở giữa file, toàn bộ thay đổi của file đó sẽ bị rollback.
