# Hướng Dẫn Quản Trị Database (Database Guide)

Tài liệu này cung cấp các hướng dẫn quan trọng khi tương tác và quản lý Database NoroFarm trên môi trường Supabase PostgreSQL.

## 1. Row Level Security (RLS)
Supabase cực kỳ mạnh mẽ nhờ cơ chế RLS của PostgreSQL. Ở `initial_schema.sql`, dữ liệu chưa được bật RLS để thuận tiện cho quá trình thử nghiệm. Trong Phase tiếp theo, bắt buộc phải:
1. Enable RLS cho từng bảng: `ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;`
2. Tạo Policy:
   - Dữ liệu public (Giá, Tin tức): Policy cho phép `SELECT` với tất cả `anon` và `authenticated`.
   - Dữ liệu private (Profiles): Policy chỉ cho phép `auth.uid() = user_id`.

## 2. Seed Data
Dữ liệu mẫu để phục vụ Development nằm ở `supabase/seed/seed.sql`.
Chạy tự động cùng với lệnh `supabase start` hoặc `supabase db reset`.

## 3. Quản Lý Timezones
Tất cả các trường Datetime đều sử dụng chuẩn `TIMESTAMPTZ` (Timestamp with Time Zone). Dữ liệu sẽ lưu mặc định là UTC. Phía client (Next.js) sẽ tự convert sang timezone của người dùng (GMT+7) khi hiển thị.

## 4. Xử Lý Enum vs Lookup Tables
Thay vì sử dụng `ENUM` thuần túy của Postgres (khó update thêm giá trị sau này), NoroFarm thống nhất sử dụng:
1. `VARCHAR` với Check Constraint nếu giá trị rất ít biến động (Ví dụ: Trạng thái tin tức `draft, published, archived`).
2. **Bảng riêng (Lookup Table)** nếu dữ liệu có tính chất mở rộng (Ví dụ: Các nhóm quyền `permissions`, `roles`, danh mục `commodity_categories`).

## 5. Sao Lưu Dữ Liệu (Backups)
Trên môi trường Supabase Production:
- Bật PITR (Point in Time Recovery) cho phép khôi phục database về bất kỳ phút nào trong vòng 7 ngày qua.
- Các bảng như `commodity_prices` nếu phình quá to (> vài chục triệu rows) sẽ cần nghiên cứu giải pháp Partitioning theo thời gian (ví dụ: chia partition theo từng Quý hoặc từng Năm).
