# Tiêu chuẩn Nhánh (Branching Standard)

## Mục tiêu
Tránh tình trạng các Developer tạo hàng đống nhánh (branches) vô tổ chức trên kho lưu trữ, gây khó khăn cho việc dọn dẹp và theo dõi.

## Quy tắc Đặt tên (Naming Rules)
AI Agent hoặc Developer khi tạo nhánh mới bắt buộc sử dụng cấu trúc sau:
`[type]/[issue_id]-[short_description]`

Trong đó:
- `[type]`: Giống y hệt loại (Type) của Commit Message (`feat`, `fix`, `docs`, `chore`).
- `[issue_id]`: Mã số Thẻ bài (Ticket) trên GitHub Issues hoặc Jira. (Ví dụ: 123)
- `[short_description]`: Mô tả ngắn gọn bằng tiếng Anh, viết thường, ngăn cách bằng dấu gạch ngang (Kebab-case).

## Ví dụ
- **Sai:** `git checkout -b fix_loi_bang_gia` (Không có loại, dùng tiếng Việt).
- **Sai:** `git checkout -b my-new-feature` (Không có Ticket ID).
- **Đúng:** `git checkout -b feat/45-add-price-alert-modal` (Chuẩn mực).
- **Đúng:** `git checkout -b fix/102-resolve-jwt-token-expiration` (Chuẩn mực).

## Dọn dẹp Nhánh (Branch Cleanup)
- Nhánh sau khi đã được Gộp (Merged) vào `main` qua Pull Request thì BẮT BUỘC phải được XÓA BỎ ngay lập tức khỏi Server (GitHub tự động cấu hình tính năng `Automatically delete head branches`).
- Không để lại rác trên Repository.
