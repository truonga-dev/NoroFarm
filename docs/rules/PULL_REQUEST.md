# Tiêu chuẩn Yêu cầu Kéo (Pull Request Standard)

## Mục tiêu
Pull Request (PR) không chỉ là Nút bấm gộp code. Nó là **Hồ sơ Trình duyệt** để đánh giá tính năng trước khi Đưa lên môi trường thật (Production).

## Cấu trúc Bắt buộc của Nội dung PR (PR Template)
Mọi PR tạo ra trên GitHub/GitLab BẮT BUỘC điền đủ các phần sau (AI Agent phải dùng Markdown sinh ra mẫu này khi tạo PR):

```markdown
## Mục tiêu PR (What does this PR do?)
[Mô tả ngắn gọn về 1-2 câu tính năng hoặc lỗi đã sửa]

## Vấn đề giải quyết (Related Issues)
Fixes #[Mã số Issue] (Vd: Fixes #123)

## Hình ảnh thay đổi (Screenshots - Nếu có đổi UI)
- [Before] (Ảnh giao diện trước khi sửa)
- [After] (Ảnh giao diện sau khi sửa)

## Danh sách Kiểm tra (Checklist)
- [ ] Code đã chạy qua Linter (Không báo lỗi Đỏ).
- [ ] Đã bổ sung Unit Test (Nếu tạo hàm Logic mới).
- [ ] Không làm hỏng các tính năng cũ (No breaking changes).
- [ ] Tuân thủ Conventional Commits.
```

## Review Policy (Quy tắc Duyệt)
- Code không bao giờ được phép Merge nếu chưa có ít nhất 1 Người khác (Reviewer) vào đọc (Code Review) và Bấm nút "Approve".
- Mọi bài kiểm tra CI/CD (GitHub Actions) phải hiện Tích Xanh (Passed). (Bao gồm Test, Lint, Build).
- Tránh tạo các "God PR" (PR chứa tới 50 file bị sửa đổi và 3000 dòng code). Rất khó để Reviewer đọc hiểu. Hãy chẻ nhỏ thành 5 PR khác nhau.
