# Tự động hóa (GitHub Actions)

## 1. Vai trò
Github Actions đóng vai trò tự động hóa mọi tác vụ buồn tẻ (Linting, Testing, Database Pushing) mỗi khi lập trình viên Push code.

## 2. Cấu trúc Workflows (`.github/workflows/`)

### A. Workflow Code Quality (Chạy trên mọi Pull Request)
- **Tên:** `lint-and-test.yml`
- **Kích hoạt:** Khi mở PR vào `main`.
- **Nhiệm vụ:**
  - Cài đặt Python và Node.js.
  - Chạy `Ruff` (Linter) cho Backend Python.
  - Chạy `Pytest` để Test API Backend.
  - Chạy `ESLint` và `Prettier` cho Frontend Next.js.
  - Nếu bất kỳ bước nào thất bại (Lỗi đỏ), nút Merge PR bị vô hiệu hóa (Block Merge).

### B. Workflow Database Migration
- **Tên:** `supabase-migration.yml`
- **Kích hoạt:** Khi PR được Merge vào `main`.
- **Nhiệm vụ:**
  - Cài đặt Supabase CLI.
  - Cung cấp `SUPABASE_ACCESS_TOKEN` và `PROJECT_ID` (Lấy từ Github Secrets).
  - Chạy lệnh `supabase db push`.
  - Cập nhật định nghĩa Type của TypeScript (`supabase gen types typescript`).

### C. Workflow Build & Deploy Backend (Tùy chọn)
- Nếu dùng Railway, tính năng này được Railway lo. Nếu tự host trên VPS/AWS:
  - Login vào Docker Hub/AWS ECR.
  - `docker build` và `docker push` image mang thẻ tag là mã Commit (Git SHA).
  - SSH vào Server và chạy `docker-compose up -d`.
