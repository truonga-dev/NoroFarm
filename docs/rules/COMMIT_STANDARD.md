# Tiêu chuẩn Thông điệp Commit (Commit Message Standard)

## Khái niệm
Mọi Commit đưa vào Git History BẮT BUỘC phải tuân thủ chuẩn **Conventional Commits**. Nếu AI sinh ra Commit Message sai chuẩn, CI/CD Pipeline (GitHub Actions) sẽ tự động Từ chối (Reject) bản Push đó.

## Định dạng Bắt buộc
```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

## Các loại (Type) Hợp lệ
- `feat`: Tính năng mới (Sẽ tự động chèn vào Changelog phần Thêm mới).
- `fix`: Sửa lỗi Bug (Sẽ tự động chèn vào Changelog phần Sửa lỗi).
- `docs`: Chỉ sửa file tài liệu, README.md, không đụng tới Code.
- `style`: Sửa đổi formatting, thiếu dấu chấm phẩy, khoảng trắng (Không đổi logic code).
- `refactor`: Viết lại code nhưng không thêm tính năng hay sửa lỗi (Tối ưu hóa).
- `perf`: Cải thiện hiệu năng (Tốc độ).
- `test`: Thêm Unit Test, E2E Test.
- `chore`: Nâng cấp phiên bản thư viện, build tool.

## Ví dụ Sai và Đúng
- **Sai:** `git commit -m "fix bug hien thi bang gia"` (Không có Type, viết Tiếng Việt không dấu).
- **Đúng:** `git commit -m "fix(pricing): resolve overlapping columns in mobile view"` (Chuẩn Conventional, viết Tiếng Anh).

## Độ dài
Subject line (Dòng đầu tiên) không được dài quá 50 ký tự. Viết thường (Lower case), bắt đầu bằng Động từ nguyên mẫu (fix, add, remove), không có dấu chấm ở cuối câu.
